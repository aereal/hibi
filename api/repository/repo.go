package repository

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/aereal/hibi/api/models"
	"golang.org/x/xerrors"
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
}

func (r *Repository) diaries() *firestore.CollectionRef {
	return r.client.Collection("diaries")
}

func (r *Repository) CreateArticle(ctx context.Context, author *models.User, newDiary NewArticle) (string, error) {
	ref := r.articles().NewDoc()
	publishedAt := time.Now()
	_, err := ref.Create(ctx, articleDTO{
		DiaryID:     newDiary.DiaryID,
		Title:       newDiary.Title,
		BodyHTML:    newDiary.BodyHTML,
		PublishedAt: publishedAt,
		AuthorID:    author.ID,
	})
	if err != nil {
		return "", xerrors.Errorf("cannot create article: %w", err)
	}
	return ref.ID, nil
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
		return nil, xerrors.Errorf("failed to populate snapshot as diary: %w", err)
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
	_, err := r.diaries().Doc(diaryID).Update(ctx, []firestore.Update{
		firestore.Update{Path: "Name", Value: settings.Name},
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
	ArticleOrderFieldPublishedAt = ArticleOrderField("PUBLISHED_AT")
)

var (
	articleFieldMapping = map[ArticleOrderField]string{
		ArticleOrderFieldPublishedAt: "PublishedAt",
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
		return nil, xerrors.Errorf("failed to article: %w", err)
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

type diaryDTO struct {
	Name    string
	OwnerID string
}

type articleDTO struct {
	DiaryID      string
	Title        string
	MarkdownBody string
	BodyHTML     string
	PublishedAt  time.Time
	AuthorID     string
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
