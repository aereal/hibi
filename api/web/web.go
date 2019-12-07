package web

import (
	"fmt"
	"net/http"

	"contrib.go.opencensus.io/exporter/stackdriver/propagation"
	"github.com/99designs/gqlgen-contrib/gqlopencensus"
	"github.com/99designs/gqlgen/graphql"
	gqlgenhandler "github.com/99designs/gqlgen/handler"
	"github.com/aereal/hibi/api/logging"
	"github.com/dimfeld/httptreemux"
	"github.com/rs/cors"
	"go.opencensus.io/plugin/ochttp"
)

func New(onGAE bool, schema graphql.ExecutableSchema) (*Web, error) {
	return &Web{onGAE: onGAE, executableSchema: schema}, nil
}

type Web struct {
	onGAE            bool
	executableSchema graphql.ExecutableSchema
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
	graphqlHandler := gqlgenhandler.GraphQL(w.executableSchema, gqlgenhandler.Tracer(gqlopencensus.New()))
	allow := cors.New(cors.Options{
		Debug:            true,
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	router.UsingContext().Handler(http.MethodOptions, "/graphql", logging.InjectLogger(allow.Handler(graphqlHandler)))
	router.UsingContext().Handler(http.MethodPost, "/graphql", logging.InjectLogger(allow.Handler(graphqlHandler)))
	return router
}

func (w *Web) Close() error {
	return nil
}
