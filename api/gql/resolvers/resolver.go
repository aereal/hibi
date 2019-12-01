//go:generate go run github.com/99designs/gqlgen -v

package resolvers

import (
	"context"

	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/dto"
)

func New() gql.ResolverRoot {
	return &rootResolver{}
}

type rootResolver struct{}

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
