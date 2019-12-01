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

	"cloud.google.com/go/firestore"
	"contrib.go.opencensus.io/exporter/stackdriver"
	"github.com/aereal/hibi/api/gql"
	"github.com/aereal/hibi/api/gql/resolvers"
	"github.com/aereal/hibi/api/repository"
	"github.com/aereal/hibi/api/web"
	"go.opencensus.io/trace"
	"golang.org/x/xerrors"
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
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return xerrors.Errorf("failed to build firestore client: %w", err)
	}

	repo, err := repository.New(client)
	if err != nil {
		return xerrors.Errorf("failed to build repo: %w", err)
	}

	schema := gql.NewExecutableSchema(gql.Config{
		Resolvers: resolvers.New(repo),
	})

	w, err := web.New(onGAE, schema)
	if err != nil {
		return xerrors.Errorf("failed to build web: %w", err)
	}
	server := w.Server(port)
	go graceful(ctx, server, 5*time.Second)

	log.Printf("starting server; accepting request on %s", server.Addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		return xerrors.Errorf("cannot start server: %w", err)
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
