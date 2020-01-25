//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"
	"fmt"

	firebaseauth "firebase.google.com/go/auth"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
	"github.com/aereal/hibi/api/logging"
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
)

func New(repo *repository.Repository, authClient *firebaseauth.Client) gql.ResolverRoot {
	return &rootResolver{repo: repo, authClient: authClient}
}

type rootResolver struct {
	repo       *repository.Repository
	authClient *firebaseauth.Client
}

func (r *rootResolver) Query() gql.QueryResolver {
	return &queryResolver{r}
}

func (r *rootResolver) Mutation() gql.MutationResolver {
	return &mutationResolver{r}
}

func (r *rootResolver) Diary() gql.DiaryResolver {
	return &diaryResolver{r}
}

func (r *rootResolver) PublishedArticle() gql.PublishedArticleResolver {
	return &articleResolver{r}
}

func (r *rootResolver) Draft() gql.DraftResolver {
	return &draftResolver{r}
}

type queryResolver struct{ *rootResolver }

func (r *queryResolver) Diary(ctx context.Context, id string) (*models.Diary, error) {
	diary, err := r.repo.FindDiary(ctx, id)
	if err != nil {
		return nil, err
	}
	return diary, nil
}

type diaryResolver struct{ *rootResolver }

const maxPerPage = 50

func (r *diaryResolver) Article(ctx context.Context, diary *models.Diary, articleID string) (dto.Article, error) {
	return r.repo.FindArticle(ctx, diary.ID, articleID)
}

func paging(page int, perPage int) (countToFetch int, offset int, err error) {
	if perPage > maxPerPage {
		err = fmt.Errorf("perPage parameter too large")
		return
	}

	pageOffset := page - 1
	if pageOffset < 0 {
		pageOffset = 0
	}
	offset = pageOffset * perPage
	countToFetch = perPage + 1

	return
}

func (r *diaryResolver) PublishedArticles(ctx context.Context, obj *models.Diary, page int, perPage int, orderBy *dto.ArticleOrder) (*dto.PublishedArticleConnection, error) {
	countToFetch, offset, err := paging(page, perPage)
	if err != nil {
		return nil, err
	}

	var (
		field     = repository.ArticleOrderFieldCreatedAt
		direction = repository.OrderDirectionAsc
	)
	if orderBy != nil {
		field = orderBy.Field
		direction = orderBy.Direction
	}
	articles, err := r.repo.FindLatestArticlesOf(ctx, obj.ID, countToFetch, offset, field, direction)
	if err != nil {
		return nil, err
	}
	conn := &dto.PublishedArticleConnection{
		PageInfo: &dto.OffsetBasePageInfo{},
	}
	for _, article := range articles {
		conn.Nodes = append(conn.Nodes, &dto.PublishedArticle{
			ID:          article.ID,
			Title:       article.Title,
			Body:        article.Body,
			PublishedAt: article.PublishedAt,
			AuthorID:    article.AuthorID,
			CreatedAt:   article.CreatedAt,
			UpdatedAt:   article.UpdatedAt,
		})
		if len(conn.Nodes) == perPage {
			break
		}
	}
	conn.PageInfo.HasNextPage = len(articles) > perPage
	if conn.PageInfo.HasNextPage {
		nextPage := page + 1
		conn.PageInfo.NextPage = &nextPage
	}
	conn.TotalCount = len(articles)
	if conn.TotalCount > perPage {
		conn.TotalCount = perPage
	}
	return conn, nil
}

func (r *diaryResolver) Articles(ctx context.Context, obj *models.Diary, page int, perPage int, orderBy *dto.ArticleOrder) (*dto.ArticleConnection, error) {
	countToFetch, offset, err := paging(page, perPage)
	if err != nil {
		return nil, err
	}

	var (
		field     = repository.ArticleOrderFieldCreatedAt
		direction = repository.OrderDirectionAsc
	)
	if orderBy != nil {
		field = orderBy.Field
		direction = orderBy.Direction
	}
	articles, err := r.repo.FindLatestArticlesOf(ctx, obj.ID, countToFetch, offset, field, direction)
	if err != nil {
		return nil, err
	}
	conn := &dto.ArticleConnection{
		PageInfo: &dto.OffsetBasePageInfo{},
	}
	for _, article := range articles {
		conn.Nodes = append(conn.Nodes, &dto.PublishedArticle{
			ID:          article.ID,
			Title:       article.Title,
			Body:        article.Body,
			PublishedAt: article.PublishedAt,
			AuthorID:    article.AuthorID,
			CreatedAt:   article.CreatedAt,
			UpdatedAt:   article.UpdatedAt,
		})
		if len(conn.Nodes) == perPage {
			break
		}
	}
	conn.PageInfo.HasNextPage = len(articles) > perPage
	if conn.PageInfo.HasNextPage {
		nextPage := page + 1
		conn.PageInfo.NextPage = &nextPage
	}
	conn.TotalCount = len(articles)
	if conn.TotalCount > perPage {
		conn.TotalCount = perPage
	}
	return conn, nil
}

func (r *diaryResolver) Owner(ctx context.Context, diary *models.Diary) (*models.User, error) {
	record, err := r.authClient.GetUser(ctx, diary.OwnerID)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		ID:   record.UID,
		Name: record.DisplayName,
	}
	return user, nil
}

func (r *diaryResolver) Drafts(ctx context.Context, diary *models.Diary, page int, perPage int, orderBy *dto.ArticleOrder) (*dto.DraftConnection, error) {
	countToFetch, offset, err := paging(page, perPage)
	if err != nil {
		return nil, err
	}

	drafts, err := r.repo.FindDraftsOf(ctx, diary.ID, countToFetch, offset)
	if err != nil {
		return nil, err
	}
	conn := &dto.DraftConnection{
		PageInfo: &dto.OffsetBasePageInfo{},
	}
	for _, draft := range drafts {
		conn.Nodes = append(conn.Nodes, &dto.Draft{
			ID:        draft.ID,
			Title:     draft.Title,
			Body:      draft.Body,
			AuthorID:  draft.AuthorID,
			CreatedAt: draft.CreatedAt,
			UpdatedAt: draft.UpdatedAt,
		})
		if len(conn.Nodes) == perPage {
			break
		}
	}
	conn.TotalCount = len(drafts)
	if conn.TotalCount > perPage {
		conn.TotalCount = perPage
	}
	conn.PageInfo.HasNextPage = len(drafts) > perPage
	if conn.PageInfo.HasNextPage {
		nextPage := page + 1
		conn.PageInfo.NextPage = &nextPage
	}

	return conn, nil
}

type mutationResolver struct{ *rootResolver }

func (r *mutationResolver) PostArticle(ctx context.Context, newArticle repository.NewArticle) (string, error) {
	visitor := auth.ForContext(ctx)
	if visitor == nil {
		return "", fmt.Errorf("[BUG] authentication failed")
	}

	diary, err := r.repo.FindDiary(ctx, newArticle.DiaryID)
	if err != nil {
		return "", err
	}

	if !diary.CanPostArticle(visitor) {
		return "", fmt.Errorf("cannot post article due to lack of permission")
	}

	articleID, err := r.repo.CreateArticle(ctx, visitor, newArticle)
	if err != nil {
		return "", err
	}
	return articleID, nil
}

func (r *mutationResolver) UpdateArticle(ctx context.Context, diaryID string, articleID string, article repository.ArticleToPost) (bool, error) {
	visitor := auth.ForContext(ctx)
	if visitor == nil {
		return false, fmt.Errorf("[BUG] authentication failed")
	}

	diary, err := r.repo.FindDiary(ctx, diaryID)
	if err != nil {
		return false, err
	}

	if !diary.CanPostArticle(visitor) {
		return false, fmt.Errorf("cannot post article due to lack of permission")
	}

	articleToUpdate, err := r.repo.FindArticleOrDraftByID(ctx, diaryID, articleID)
	if err != nil {
		return false, fmt.Errorf("cannot find article(%q): %w", articleID, err)
	}

	if articleToUpdate.GetAuthorID() != visitor.ID {
		return false, fmt.Errorf("cannot update article by others")
	}

	err = r.repo.UpdateArticle(ctx, articleToUpdate, article)
	if err != nil {
		return false, fmt.Errorf("cannot update article: %w", err)
	}

	return true, nil
}

func (r *mutationResolver) UpdateDiarySettings(ctx context.Context, diaryID string, settings repository.DiarySettings) (bool, error) {
	logger := logging.FromContext(ctx)
	logger.Infof("diaryID=%v settings=%#v", diaryID, settings)

	visitor := auth.ForContext(ctx)
	if visitor == nil {
		return false, fmt.Errorf("[BUG] authentication failed")
	}

	diary, err := r.repo.FindDiary(ctx, diaryID)
	if err != nil {
		return false, err
	}

	if !diary.CanUpdateSettings(visitor) {
		return false, fmt.Errorf("cannot update diary settings due to lack of permission")
	}

	if err := r.repo.UpdateDiarySettings(ctx, diary.ID, settings); err != nil {
		return false, fmt.Errorf("failed to update diary settings: %w", err)
	}
	return true, nil
}

type articleResolver struct{ *rootResolver }

func (r *articleResolver) Author(ctx context.Context, article *dto.PublishedArticle) (*models.User, error) {
	record, err := r.authClient.GetUser(ctx, article.AuthorID)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		ID:   record.UID,
		Name: record.DisplayName,
	}
	return user, nil
}

type draftResolver struct{ *rootResolver }

func (r *draftResolver) Author(ctx context.Context, draft *dto.Draft) (*models.User, error) {
	return nil, nil
}
