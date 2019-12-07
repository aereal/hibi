package logging

import (
	"context"
	"net/http"

	log "github.com/yfuruyama/stackdriver-request-context-log"
)

type Middleware func(http.Handler) http.Handler

func InjectLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := log.RequestContextLogger(r)
		if logger == nil {
			next.ServeHTTP(w, r)
			return
		}

		ctx := context.WithValue(r.Context(), loggerKey, logger)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type contextKey struct{}

var loggerKey = &contextKey{}

func FromContext(ctx context.Context) *log.ContextLogger {
	if v, ok := ctx.Value(loggerKey).(*log.ContextLogger); ok {
		return v
	}
	return nil
}

func FromRequest(r *http.Request) *log.ContextLogger {
	return FromContext(r.Context())
}
