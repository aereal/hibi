package web

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"contrib.go.opencensus.io/exporter/stackdriver/propagation"
	"firebase.google.com/go/auth"
	"github.com/99designs/gqlgen-contrib/gqlopencensus"
	"github.com/99designs/gqlgen/graphql"
	gqlgenhandler "github.com/99designs/gqlgen/handler"
	"github.com/aereal/hibi/api/logging"
	"github.com/dimfeld/httptreemux"
	"github.com/rs/cors"
	"go.opencensus.io/plugin/ochttp"
)

func New(onGAE bool, schema graphql.ExecutableSchema, authClient *auth.Client) (*Web, error) {
	return &Web{onGAE: onGAE, executableSchema: schema, authClient: authClient}, nil
}

type Web struct {
	onGAE            bool
	executableSchema graphql.ExecutableSchema
	authClient       *auth.Client
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
		Debug: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowCredentials: true,
		AllowedHeaders:   []string{"authorization"},
	})
	router.UsingContext().Handler(http.MethodOptions, "/graphql", logging.InjectLogger(allow.Handler(graphqlHandler)))
	router.UsingContext().Handler(http.MethodPost, "/graphql", logging.InjectLogger(allow.Handler(graphqlHandler)))
	router.UsingContext().Handler(http.MethodOptions, "/auth", logging.InjectLogger(allow.Handler(w.authHandler())))
	router.UsingContext().Handler(http.MethodGet, "/auth", logging.InjectLogger(allow.Handler(w.authHandler())))
	return router
}

type authResp struct {
	Ok    bool                   `json:"ok"`
	Error string                 `json:"error,omitempty"`
	Data  map[string]interface{} `json:"data,omitempty"`
}

func (h *Web) authHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("authorization")
		authz := strings.SplitN(auth, " ", 2)
		resp := authResp{Data: map[string]interface{}{}}

		w.Header().Set("content-type", "application/json")
		if authz[0] != "Bearer" || authz[1] == "" {
			w.WriteHeader(http.StatusUnauthorized)
			resp.Ok = false
			resp.Error = "invalid authorization header"
		} else {
			token, err := h.authClient.VerifyIDToken(r.Context(), authz[1])
			if err != nil {
				resp.Ok = false
				resp.Error = fmt.Sprintf("failed to verify token: %s", err)
			} else {
				resp.Ok = true
				resp.Data["issuer"] = token.Issuer
				resp.Data["audience"] = token.Audience
				resp.Data["subject"] = token.Subject
				resp.Data["issuedAt"] = time.Unix(token.IssuedAt, 0)
				resp.Data["expiresAt"] = time.Unix(token.Expires, 0)
				resp.Data["claims"] = token.Claims
			}
		}

		json.NewEncoder(w).Encode(&resp)
	})
}

func (w *Web) Close() error {
	return nil
}
