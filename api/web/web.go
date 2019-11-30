package web

import (
	"fmt"
	"net/http"

	"contrib.go.opencensus.io/exporter/stackdriver/propagation"
	"github.com/99designs/gqlgen/graphql"
	gqlgenhandler "github.com/99designs/gqlgen/handler"
	"github.com/dimfeld/httptreemux"
	"go.opencensus.io/plugin/ochttp"
)

func New(onGAE bool, schema graphql.ExecutableSchema) (*Web, error) {
	return &Web{onGAE: onGAE, executableSchema: schema}, nil
}

type Web struct {
	onGAE            bool
	executableSchema graphql.ExecutableSchema
}

func (w *Web) Server(port string) *http.Server {
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

	return &http.Server{
		Addr:    fmt.Sprintf("%s:%s", host, port),
		Handler: handler,
	}
}

func (w *Web) handler() http.Handler {
	router := httptreemux.New()
	router.UsingContext().GET("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "OK")
	}))
	graphqlHandler := gqlgenhandler.GraphQL(w.executableSchema)
	router.UsingContext().POST("/graphql", graphqlHandler)
	return router
}

func (w *Web) Close() error {
	return nil
}
