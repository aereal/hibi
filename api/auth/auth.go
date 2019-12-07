package auth

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"firebase.google.com/go/auth"
	"github.com/aereal/hibi/api/logging"
	"github.com/aereal/hibi/api/models"
)

type contextKey struct{}

var userKey = &contextKey{}

func WithAuthentication(authClient *auth.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger := logging.FromRequest(r)

			auth := r.Header.Get("authorization")
			authz := strings.SplitN(auth, " ", 2)

			if authz[0] != "Bearer" || authz[1] == "" {
				logger.Warn("invalid authorization header")
				next.ServeHTTP(w, r)
				return
			}

			ctx := r.Context()
			token, err := authClient.VerifyIDToken(ctx, authz[1])
			if err != nil {
				logger.Warnf("cannot verify token: %s", err)
				next.ServeHTTP(w, r)
				return
			}

			user, err := getUser(ctx, authClient, token)
			if err != nil {
				logger.Warnf("failed to get user: %s", err)
				next.ServeHTTP(w, r)
			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(ctx, userKey, user)))
		})
	}
}

func getUser(ctx context.Context, authClient *auth.Client, token *auth.Token) (*models.User, error) {
	record, err := authClient.GetUser(ctx, token.UID)
	if err != nil {
		return nil, err
	}
	user := &models.User{
		ID:   record.UID,
		Name: record.DisplayName,
	}
	return user, nil
}

func ForContext(ctx context.Context) *models.User {
	if user, ok := ctx.Value(userKey).(*models.User); ok && user != nil {
		return user
	}
	return models.GUEST
}

type Role int

const (
	_              = iota
	RoleGuest Role = 1 << iota
	RoleAdmin
)

func (r Role) HasPrivilegeOf(other Role) bool {
	return r >= other
}

func (r Role) IsValid() bool {
	switch r {
	case RoleAdmin, RoleGuest:
		return true
	}
	return false
}

func (r Role) String() string {
	switch r {
	case RoleAdmin:
		return "ADMIN"
	case RoleGuest:
		return "GUEST"
	default:
		return "UNKNOWN"
	}
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	switch str {
	case "ADMIN":
		*e = RoleAdmin
	case "GUEST":
		*e = RoleGuest
	}
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
