package auth

import (
	"context"
	"net/http"
	"strings"

	"firebase.google.com/go/auth"
	"github.com/aereal/hibi/api/logging"
)

type contextKey struct{}

var userKey = &contextKey{}

type User struct {
	VerifiedToken *auth.Token
}

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

			token, err := authClient.VerifyIDToken(r.Context(), authz[1])
			if err != nil {
				logger.Warnf("cannot verify token: %s", err)
				next.ServeHTTP(w, r)
				return
			}

			user := &User{VerifiedToken: token}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userKey, user)))
		})
	}
}

func ForContext(ctx context.Context) *User {
	user, _ := ctx.Value(userKey).(*User)
	return user
}
