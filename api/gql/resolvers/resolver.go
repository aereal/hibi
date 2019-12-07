//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"
	"fmt"

	firebaseauth "firebase.google.com/go/auth"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
	"gopkg.in/russross/blackfriday.v2"
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

func (r *rootResolver) ArticleBody() gql.ArticleBodyResolver {
	return &articleBodyResolver{r}
}

func (r *rootResolver) Article() gql.ArticleResolver {
	return &articleResolver{r}
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

func (r *diaryResolver) Articles(ctx context.Context, obj *models.Diary, first int, orderBy *dto.ArticleOrder) (*dto.ArticleConnection, error) {
	var (
		field     = repository.ArticleOrderFieldPublishedAt
		direction = repository.OrderDirectionAsc
	)
	if orderBy != nil {
		field = orderBy.Field
		direction = orderBy.Direction
	}
	articles, err := r.repo.FindLatestArticlesOf(ctx, obj.ID, first+1, field, direction)
	if err != nil {
		return nil, err
	}
	conn := &dto.ArticleConnection{
		PageInfo: &dto.PageInfo{},
	}
	for _, article := range articles {
		conn.Nodes = append(conn.Nodes, article)
		if len(conn.Nodes) == first {
			break
		}
	}
	conn.PageInfo.EndCursor = &articles[len(articles)-1].ID
	conn.PageInfo.HasNextPage = len(articles) > first
	conn.TotalCount = len(articles)
	if conn.TotalCount > first {
		conn.TotalCount = first
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

type articleBodyResolver struct{ *rootResolver }

func (r *articleBodyResolver) HTML(ctx context.Context, body *models.ArticleBody) (string, error) {
	rendered := blackfriday.Run([]byte(body.Markdown))
	return string(rendered), nil
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

type articleResolver struct{ *rootResolver }

func (r *articleResolver) Author(ctx context.Context, article *models.Article) (*models.User, error) {
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
