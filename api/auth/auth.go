package auth

import (
	"context"
	"net/http"
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
