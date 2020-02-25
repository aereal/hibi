package web

import (
	"encoding/json"
	"fmt"
	"net/http"

	"contrib.go.opencensus.io/exporter/stackdriver/propagation"
	firebaseauth "firebase.google.com/go/auth"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/aereal/hibi/api/auth"
	"github.com/aereal/hibi/api/logging"
	"github.com/dimfeld/httptreemux"
	"github.com/rs/cors"
	"go.opencensus.io/plugin/ochttp"
)

func New(onGAE bool, schema graphql.ExecutableSchema, authClient *firebaseauth.Client) (*Web, error) {
	return &Web{onGAE: onGAE, executableSchema: schema, authClient: authClient}, nil
}

type Web struct {
	onGAE            bool
	executableSchema graphql.ExecutableSchema
	authClient       *firebaseauth.Client
}

func (w *Web) Server(port string, middleware ...func(prev http.Handler) http.Handler) *http.Server {
	var (
		host                 = "localhost"
		handler http.Handler = w.handler()
	)

	if w.onGAE {
		host = ""
		handler = &ochttp.Handler{
			Handler:     handler,
			Propagation: &propagation.HTTPFormat{},
		}
	}

	for _, mw := range middleware {
		handler = mw(handler)
	}

	return &http.Server{
		Addr:    fmt.Sprintf("%s:%s", host, port),
		Handler: handler,
	}
}

func (w *Web) handler() http.Handler {
	router := httptreemux.New()
	router.UsingContext().GET("/", logging.InjectLogger(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger := logging.FromRequest(r)
		logger.Info("OK")
		fmt.Fprintln(w, "OK")
	})).ServeHTTP)
	srv := handler.New(w.executableSchema)
	allow := cors.New(cors.Options{
		Debug: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowCredentials: true,
		AllowedHeaders:   []string{"authorization", "content-type"},
	})
	handle := func(next http.Handler) http.Handler {
		return logging.InjectLogger(allow.Handler(auth.WithAuthentication(w.authClient)(next)))
	}
	router.UsingContext().Handler(http.MethodOptions, "/graphql", handle(srv))
	router.UsingContext().Handler(http.MethodPost, "/graphql", handle(srv))
	router.UsingContext().Handler(http.MethodOptions, "/auth", handle(w.authHandler()))
	router.UsingContext().Handler(http.MethodGet, "/auth", handle(w.authHandler()))
	return router
}

type authResp struct {
	Ok    bool                   `json:"ok"`
	Error string                 `json:"error,omitempty"`
	Data  map[string]interface{} `json:"data,omitempty"`
}

func (h *Web) authHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := authResp{Data: map[string]interface{}{}}
		user := auth.ForContext(r.Context())
		resp.Ok = user != nil

		w.Header().Set("content-type", "application/json")
		json.NewEncoder(w).Encode(&resp)
	})
}

func (w *Web) Close() error {
	return nil
}
