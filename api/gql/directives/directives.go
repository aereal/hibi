package directives

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/gql"
)

func New() gql.DirectiveRoot {
	return gql.DirectiveRoot{HasRole: hasRole}
}

func hasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role *auth.Role) (interface{}, error) {
	requiredRole := auth.RoleGuest
	if role != nil {
		requiredRole = *role
	}

	assumedRole := auth.RoleGuest
	if user := auth.ForContext(ctx); user != nil {
		assumedRole = auth.RoleAdmin
	}

	hasPrivilege := assumedRole.HasPrivilegeOf(requiredRole)
	if !hasPrivilege {
		return nil, fmt.Errorf("access denied; required role=%s but assumed %s", requiredRole, assumedRole)
	}

	return next(ctx)
}
