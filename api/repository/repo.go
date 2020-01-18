package repository

import (
	"context"
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/aereal/hibi/api/models"
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
	Title    string
	BodyHTML string
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
		return "", xerrors.Errorf("cannot create draft: %w", err)
	}
	return ref.ID, nil
}

func (r *Repository) UpdateArticle(ctx context.Context, articleID string, article ArticleToPost) error {
	ref := r.articles().Doc(articleID)
	now := time.Now()
	_, err := ref.Update(ctx, []firestore.Update{
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

func (r *Repository) FindArticle(ctx context.Context, diaryID string, articleID string) (*models.Article, error) {
	snapshot, err := r.articles().Doc(articleID).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return snapshotToArticle(snapshot)
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

func (r *Repository) FindLatestArticlesOf(ctx context.Context, diaryID string, limit, offset int, orderField ArticleOrderField, dir OrderDirection) ([]*models.Article, error) {
	iter := r.articles().
		OrderBy(articleFieldMapping[orderField], firestoreOrderDirectionMapping[dir]).
		Where("DiaryID", "==", diaryID).
		Limit(limit).
		Offset(offset).
		Documents(ctx)
	return r.populateArticles(iter)
}

func (r *Repository) FindDraftsOf(ctx context.Context, diaryID string, limit, offset int) ([]*models.Draft, error) {
	iter := r.drafts().Where("DiaryID", "==", diaryID).Limit(limit).Offset(offset).Documents(ctx)
	return populateDrafts(iter)
}

func (r *Repository) articles() *firestore.CollectionRef {
	return r.client.Collection("articles")
}

func (r *Repository) populateArticles(articlesIter *firestore.DocumentIterator) ([]*models.Article, error) {
	results := []*models.Article{}
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

func snapshotToArticle(snapshot *firestore.DocumentSnapshot) (*models.Article, error) {
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
	return &models.Article{
		ID:          snapshot.Ref.ID,
		Title:       &dto.Title,
		Body:        body,
		PublishedAt: dto.PublishedAt,
		AuthorID:    dto.AuthorID,
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
		return nil, xerrors.Errorf("failed to decode data to draft: %w", err)
	}
	body := &models.ArticleBody{Markdown: dto.MarkdownBody}
	if dto.BodyHTML != "" {
		body.SetHTML(dto.BodyHTML)
	}
	return &models.Draft{
		ID:       snapshot.Ref.ID,
		Title:    &dto.Title,
		Body:     body,
		AuthorID: dto.AuthorID,
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
