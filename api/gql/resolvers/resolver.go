//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"

	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
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

type queryResolver struct{ *rootResolver }

func (r *queryResolver) Diary(ctx context.Context, id string) (*models.Diary, error) {
	diary := &models.Diary{}
	return diary, nil
}

type diaryResolver struct{ *rootResolver }

func (r *diaryResolver) Articles(ctx context.Context, obj *models.Diary) (*dto.ArticleConnection, error) {
	conn := &dto.ArticleConnection{}
	article := &models.Article{
		ID: "1",
		Body: &models.ArticleBody{
			Markdown: "# poppoe\n",
			HTML:     "<h1>poppoe</h1>\n",
		},
	}
	conn.Nodes = append(conn.Nodes, article)
	return conn, nil
}
