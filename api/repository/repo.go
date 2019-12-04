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

func (r *Repository) FindDiaries(ctx context.Context, limit int) ([]*models.Diary, error) {
	iter := r.diaries().Limit(limit).Documents(ctx)
	return r.populateDiaries(iter)
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
		Name: dto.Name,
		ID:   snapshot.Ref.ID,
	}
	return diary, nil
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

func (r *Repository) FindLatestArticlesOf(ctx context.Context, diaryID string, limit int, orderField ArticleOrderField, dir OrderDirection) ([]*models.Article, error) {
	iter := r.articles().
		OrderBy(articleFieldMapping[orderField], firestoreOrderDirectionMapping[dir]).
		Where("DiaryID", "==", diaryID).
		Limit(limit).
		Documents(ctx)
	return r.populateArticles(iter)
}

func (r *Repository) articles() *firestore.CollectionRef {
	return r.client.Collection("articles")
}

func (r *Repository) diaries() *firestore.CollectionRef {
	return r.client.Collection("diaries")
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
		var dto articleDTO
		if err := snapshot.DataTo(&dto); err != nil {
			return nil, xerrors.Errorf("failed to article: %w", err)
		}
		results = append(results, &models.Article{
			ID:    snapshot.Ref.ID,
			Title: &dto.Title,
			Body: &models.ArticleBody{
				Markdown: dto.MarkdownBody,
			},
			PublishedAt: dto.PublishedAt,
		})
	}
	return results, nil
}

func (r *Repository) populateDiaries(diariesIter *firestore.DocumentIterator) ([]*models.Diary, error) {
	results := []*models.Diary{}
	for {
		snapshot, err := diariesIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var dto diaryDTO
		if err := snapshot.DataTo(&dto); err != nil {
			return nil, xerrors.Errorf("failed to article: %w", err)
		}
		results = append(results, &models.Diary{
			ID:   snapshot.Ref.ID,
			Name: dto.Name,
		})
	}
	return results, nil
}

type diaryDTO struct {
	Name string
}

type articleDTO struct {
	DiaryID      string
	Title        string
	MarkdownBody string
	PublishedAt  time.Time
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
