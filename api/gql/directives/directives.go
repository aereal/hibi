package directives

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/models"
)

func New() gql.DirectiveRoot {
	return gql.DirectiveRoot{HasRole: hasRole}
}

func hasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role *models.Role) (interface{}, error) {
	requiredRole := models.RoleGuest
	if role != nil {
		requiredRole = *role
	}

	assumedRole := models.RoleGuest
	if user := auth.ForContext(ctx); user != nil {
		assumedRole = user.Role()
	}

	hasPrivilege := assumedRole.HasPrivilegeOf(requiredRole)
	if !hasPrivilege {
		return nil, fmt.Errorf("access denied; required role=%s but assumed %s", requiredRole, assumedRole)
	}

	return next(ctx)
}
