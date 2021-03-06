package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"contrib.go.opencensus.io/exporter/stackdriver"
	firebase "firebase.google.com/go"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/directives"
	"github.com/aereal/hibi/api/gql/resolvers"
	"github.com/aereal/hibi/api/repository"
	"github.com/aereal/hibi/api/web"
	clog "github.com/yfuruyama/stackdriver-request-context-log"
	"go.opencensus.io/trace"
)

var onGAE bool

func init() {
	onGAE = os.Getenv("GAE_ENV") != ""
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%+v\n", err)
		os.Exit(1)
	}
}

func run() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if onGAE {
		exporter, err := stackdriver.NewExporter(stackdriver.Options{Context: ctx})
		if err != nil {
			return err
		}
		defer exporter.Flush()
		trace.RegisterExporter(exporter)
	}

	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	if projectID == "" {
		return errors.New("GOOGLE_CLOUD_PROJECT must be defined")
	}

	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to initialize firebase admin SDK: %w", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		return fmt.Errorf("failed to initialize Firebase Authentication client: %w", err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		return fmt.Errorf("failed to build firestore client: %w", err)
	}

	repo, err := repository.New(client)
	if err != nil {
		return fmt.Errorf("failed to build repo: %w", err)
	}

	schema := gql.NewExecutableSchema(gql.Config{
		Resolvers:  resolvers.New(repo, authClient),
		Directives: directives.New(),
	})

	cfg := clog.NewConfig(projectID)
	cfg.RequestLogOut = os.Stderr
	cfg.ContextLogOut = os.Stdout
	cfg.Severity = clog.SeverityInfo

	w, err := web.New(onGAE, schema, authClient)
	if err != nil {
		return fmt.Errorf("failed to build web: %w", err)
	}
	server := w.Server(port, clog.RequestLogging(cfg))
	go graceful(ctx, server, 5*time.Second)

	log.Printf("starting server; accepting request on %s", server.Addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		return fmt.Errorf("cannot start server: %w", err)
	}

	return nil
}

func graceful(parent context.Context, server *http.Server, timeout time.Duration) {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	sig := <-sigChan
	ctx, cancel := context.WithTimeout(parent, timeout)
	defer cancel()
	log.Printf("shutting down server signal=%q", sig)
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("failed to shutdown: %s", err)
	}
}
