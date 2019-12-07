package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/logging"
)

func New() gql.DirectiveRoot {
	return gql.DirectiveRoot{HasRole: hasRole}
}

func hasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role *auth.Role) (interface{}, error) {
	logger := logging.FromContext(ctx)
	logger.Infof("hasRole: obj=%#v role=%v", obj, role)
	return next(ctx)
}
