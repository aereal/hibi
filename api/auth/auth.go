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

type Role int

const (
	_              = iota
	RoleGuest Role = 1 << iota
	RoleAdmin
)

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
