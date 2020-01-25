package repository

import (
	"context"
	"fmt"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/aereal/hibi/api/models"
	"golang.org/x/sync/errgroup"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func New(client *firestore.Client) (*Repository, error) {
	return &Repository{client: client}, nil
}

type Repository struct {
	client *firestore.Client
}

type NewArticle struct {
	DiaryID  string
	Title    string
	BodyHTML string
	IsDraft  bool
}

type ArticleToPost struct {
	Title        string
	BodyHTML     string
	PublishState *models.PublishState
}

func (r *Repository) diaries() *firestore.CollectionRef {
	return r.client.Collection("diaries")
}

func (r *Repository) CreateArticle(ctx context.Context, author *models.User, newArticle NewArticle) (string, error) {
	if newArticle.IsDraft {
		return r.createDraft(ctx, author, newArticle)
	}
	return r.createArticle(ctx, author, newArticle)
}

func (r *Repository) createArticle(ctx context.Context, author *models.User, newArticle NewArticle) (string, error) {
	ref := r.articles().NewDoc()
	now := time.Now()
	_, err := ref.Create(ctx, articleDTO{
		DiaryID:     newArticle.DiaryID,
		Title:       newArticle.Title,
		BodyHTML:    newArticle.BodyHTML,
		PublishedAt: now,
		CreatedAt:   now,
		UpdatedAt:   now,
		AuthorID:    author.ID,
	})
	if err != nil {
		return "", fmt.Errorf("cannot create article: %w", err)
	}
	return ref.ID, nil
}

func (r *Repository) createDraft(ctx context.Context, author *models.User, newArticle NewArticle) (string, error) {
	ref := r.drafts().NewDoc()
	now := time.Now()
	_, err := ref.Create(ctx, draftDTO{
		DiaryID:   newArticle.DiaryID,
		Title:     newArticle.Title,
		BodyHTML:  newArticle.BodyHTML,
		CreatedAt: now,
		UpdatedAt: now,
		AuthorID:  author.ID,
	})
	if err != nil {
		return "", fmt.Errorf("cannot create draft: %w", err)
	}
	return ref.ID, nil
}

func (r *Repository) guessedCollection(article models.Article) (*firestore.CollectionRef, error) {
	switch t := article.(type) {
	case *models.PublishedArticle:
		return r.articles(), nil
	case *models.Draft:
		return r.drafts(), nil
	default:
		return nil, fmt.Errorf("[BUG] unknown type: %T", t)
	}
}

func (r *Repository) UpdateArticle(ctx context.Context, prevArticle models.Article, article ArticleToPost) error {
	nextState := prevArticle.GetPublishState()
	if article.PublishState != nil {
		nextState = *article.PublishState
	}
	if !prevArticle.GetPublishState().CanChangeTo(nextState) {
		return fmt.Errorf("current state (%s) cannot change to %s", prevArticle.GetPublishState(), nextState)
	}

	coll, err := r.guessedCollection(prevArticle)
	if err != nil {
		return err
	}

	articleID := prevArticle.GetID()
	ref := coll.Doc(articleID)
	now := time.Now()
	_, err = ref.Update(ctx, []firestore.Update{
		firestore.Update{
			Path:  "Title",
			Value: article.Title,
		},
		firestore.Update{
			Path:  "BodyHTML",
			Value: article.BodyHTML,
		},
		firestore.Update{
			Path:  "UpdatedAt",
			Value: now,
		},
	})
	if err != nil {
		return fmt.Errorf("cannot update article(%q): %w", articleID, err)
	}
	return nil
}

func (r *Repository) FindDiary(ctx context.Context, id string) (*models.Diary, error) {
	snapshot, err := r.diaries().Doc(id).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var dto diaryDTO
	if err := snapshot.DataTo(&dto); err != nil {
		return nil, fmt.Errorf("failed to populate snapshot as diary: %w", err)
	}
	diary := &models.Diary{
		Name:    dto.Name,
		ID:      snapshot.Ref.ID,
		OwnerID: dto.OwnerID,
	}
	return diary, nil
}

type DiarySettings struct {
	Name string
}

func (r *Repository) UpdateDiarySettings(ctx context.Context, diaryID string, settings DiarySettings) error {
	now := time.Now()
	_, err := r.diaries().Doc(diaryID).Update(ctx, []firestore.Update{
		firestore.Update{Path: "Name", Value: settings.Name},
		firestore.Update{
			Path:  "UpdatedAt",
			Value: now,
		},
	})
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) FindArticle(ctx context.Context, diaryID string, articleID string) (*models.PublishedArticle, error) {
	snapshot, err := r.articles().Doc(articleID).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return snapshotToArticle(snapshot)
}

func (r *Repository) FindDraft(ctx context.Context, diaryID string, articleID string) (*models.Draft, error) {
	snapshot, err := r.drafts().Doc(articleID).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return snapshotToDraft(snapshot)
}

func (r *Repository) FindArticleOrDraftByID(ctx context.Context, diaryID string, id string) (models.Article, error) {
	var (
		eg        *errgroup.Group
		published *models.PublishedArticle
		draft     *models.Draft
	)
	eg, ctx = errgroup.WithContext(ctx)
	eg.Go(func() error {
		var err error
		published, err = r.FindArticle(ctx, diaryID, id)
		return err
	})
	eg.Go(func() error {
		var err error
		draft, err = r.FindDraft(ctx, diaryID, id)
		return err
	})
	if err := eg.Wait(); err != nil {
		return nil, err
	}

	if published != nil && draft != nil {
		return nil, fmt.Errorf("[BUG]")
	}
	if published != nil {
		return published, nil
	}
	if draft != nil {
		return draft, nil
	}

	return nil, nil
}

type ArticleOrderField string

const (
	ArticleOrderFieldCreatedAt = ArticleOrderField("CREATED_AT")
	ArticleOrderFieldUpdatedAt = ArticleOrderField("UPDATED_AT")
)

var (
	articleFieldMapping = map[ArticleOrderField]string{
		ArticleOrderFieldCreatedAt: "CreatedAt",
		ArticleOrderFieldUpdatedAt: "UpdatedAt",
	}
)

func (r *Repository) FindLatestArticlesOf(ctx context.Context, diaryID string, limit, offset int, orderField ArticleOrderField, dir OrderDirection) ([]*models.PublishedArticle, error) {
	iter := r.articles().
		OrderBy(articleFieldMapping[orderField], firestoreOrderDirectionMapping[dir]).
		Where("DiaryID", "==", diaryID).
		Limit(limit).
		Offset(offset).
		Documents(ctx)
	return r.populateArticles(iter)
}

func (r *Repository) findDrafts(ctx context.Context, diaryID string, limit, offset int, orderField ArticleOrderField, dir OrderDirection) ([]*models.Draft, error) {
	iter := r.drafts().
		OrderBy(articleFieldMapping[orderField], firestoreOrderDirectionMapping[dir]).
		Where("DiaryID", "==", diaryID).
		Limit(limit).
		Offset(offset).
		Documents(ctx)
	return populateDrafts(iter)
}

func (r *Repository) FindArticlesOf(ctx context.Context, diaryID string, limit, offset int, orderField ArticleOrderField, dir OrderDirection, states []models.PublishState) ([]models.Article, error) {
	published := []*models.PublishedArticle{}
	drafts := []*models.Draft{}

	var eg *errgroup.Group
	eg, ctx = errgroup.WithContext(ctx)
	for _, state := range states {
		switch state {
		case models.PublishStatePublished:
			eg.Go(func() error {
				var err error
				published, err = r.FindLatestArticlesOf(ctx, diaryID, limit, offset, orderField, dir)
				return err
			})
		case models.PublishStateDraft:
			eg.Go(func() error {
				var err error
				drafts, err = r.findDrafts(ctx, diaryID, limit, offset, orderField, dir)
				return err
			})
		}
	}

	if err := eg.Wait(); err != nil {
		return nil, err
	}

	results := byCreatedAt{}
	for _, a := range published {
		results = append(results, a)
	}
	for _, d := range drafts {
		results = append(results, d)
	}
	sort.Sort(results)
	if len(results) > limit {
		results = results[0 : limit-1]
	}
	return results, nil
}

type byCreatedAt []models.Article

func (a byCreatedAt) Len() int           { return len(a) }
func (a byCreatedAt) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a byCreatedAt) Less(i, j int) bool { return a[i].GetCreatedAt().Before(a[j].GetCreatedAt()) }

func (r *Repository) FindDraftsOf(ctx context.Context, diaryID string, limit, offset int) ([]*models.Draft, error) {
	iter := r.drafts().Where("DiaryID", "==", diaryID).Limit(limit).Offset(offset).Documents(ctx)
	return populateDrafts(iter)
}

func (r *Repository) articles() *firestore.CollectionRef {
	return r.client.Collection("articles")
}

func (r *Repository) populateArticles(articlesIter *firestore.DocumentIterator) ([]*models.PublishedArticle, error) {
	results := []*models.PublishedArticle{}
	for {
		snapshot, err := articlesIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		article, err := snapshotToArticle(snapshot)
		results = append(results, article)
	}
	return results, nil
}

func snapshotToArticle(snapshot *firestore.DocumentSnapshot) (*models.PublishedArticle, error) {
	var dto articleDTO
	if err := snapshot.DataTo(&dto); err != nil {
		return nil, fmt.Errorf("failed to article: %w", err)
	}
	body := &models.ArticleBody{
		Markdown: dto.MarkdownBody,
	}
	if dto.BodyHTML != "" {
		body.SetHTML(dto.BodyHTML)
	}
	return &models.PublishedArticle{
		ID:          snapshot.Ref.ID,
		Title:       &dto.Title,
		Body:        body,
		PublishedAt: dto.PublishedAt,
		AuthorID:    dto.AuthorID,
		CreatedAt:   dto.CreatedAt,
		UpdatedAt:   dto.UpdatedAt,
	}, nil
}

func (r *Repository) drafts() *firestore.CollectionRef {
	return r.client.Collection("drafts")
}

func populateDrafts(iter *firestore.DocumentIterator) ([]*models.Draft, error) {
	results := []*models.Draft{}
	for {
		snapshot, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		draft, err := snapshotToDraft(snapshot)
		results = append(results, draft)
	}
	return results, nil
}

func snapshotToDraft(snapshot *firestore.DocumentSnapshot) (*models.Draft, error) {
	var dto draftDTO
	if err := snapshot.DataTo(&dto); err != nil {
		return nil, fmt.Errorf("failed to decode data to draft: %w", err)
	}
	body := &models.ArticleBody{Markdown: dto.MarkdownBody}
	if dto.BodyHTML != "" {
		body.SetHTML(dto.BodyHTML)
	}
	return &models.Draft{
		ID:        snapshot.Ref.ID,
		Title:     &dto.Title,
		Body:      body,
		AuthorID:  dto.AuthorID,
		CreatedAt: dto.CreatedAt,
		UpdatedAt: dto.UpdatedAt,
	}, nil
}

type diaryDTO struct {
	Name      string
	OwnerID   string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type articleDTO struct {
	DiaryID      string
	Title        string
	MarkdownBody string
	BodyHTML     string
	PublishedAt  time.Time
	AuthorID     string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type draftDTO struct {
	DiaryID      string
	Title        string
	MarkdownBody string
	BodyHTML     string
	AuthorID     string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type OrderDirection string

const (
	OrderDirectionAsc  OrderDirection = "ASC"
	OrderDirectionDesc OrderDirection = "DESC"
)

var (
	firestoreOrderDirectionMapping = map[OrderDirection]firestore.Direction{
		OrderDirectionAsc:  firestore.Asc,
		OrderDirectionDesc: firestore.Desc,
	}
)
