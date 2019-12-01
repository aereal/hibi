//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"

	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
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

type queryResolver struct{ *rootResolver }

func (r *queryResolver) Diary(ctx context.Context, id string) (*dto.Diary, error) {
	diary := &dto.Diary{
		Articles: &dto.ArticleConnection{},
	}
	diary.Articles.Nodes = append(diary.Articles.Nodes, &dto.Article{ID: "1"})
	return diary, nil
}
