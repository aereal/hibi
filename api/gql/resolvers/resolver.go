//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"

	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
	"gopkg.in/russross/blackfriday.v2"
)

func New(repo *repository.Repository) gql.ResolverRoot {
	return &rootResolver{repo: repo}
}

type rootResolver struct {
	repo *repository.Repository
}

func (r *rootResolver) Query() gql.QueryResolver {
	return &queryResolver{r}
}

func (r *rootResolver) Diary() gql.DiaryResolver {
	return &diaryResolver{r}
}

func (r *rootResolver) ArticleBody() gql.ArticleBodyResolver {
	return &articleBodyResolver{r}
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

func (r *diaryResolver) Articles(ctx context.Context, obj *models.Diary, first int) (*dto.ArticleConnection, error) {
	articles, err := r.repo.FindLatestArticlesOf(ctx, obj.ID, first+1)
	if err != nil {
		return nil, err
	}
	conn := &dto.ArticleConnection{
		PageInfo: &dto.PageInfo{},
	}
	for _, article := range articles {
		conn.Nodes = append(conn.Nodes, article)
	}
	conn.PageInfo.EndCursor = &articles[len(articles)-1].ID
	conn.PageInfo.HasNextPage = len(articles) > first
	conn.TotalCount = len(articles)
	if conn.TotalCount > first {
		conn.TotalCount = first
	}
	return conn, nil
}

type articleBodyResolver struct{ *rootResolver }

func (r *articleBodyResolver) HTML(ctx context.Context, body *models.ArticleBody) (string, error) {
	rendered := blackfriday.Run([]byte(body.Markdown))
	return string(rendered), nil
}
