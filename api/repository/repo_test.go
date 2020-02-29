package repository

import (
	"context"
	"errors"
	"testing"

	"cloud.google.com/go/firestore"
)

func TestRepository_FindDrafts_order(t *testing.T) {
	ctx := context.Background()
	r := &Repository{client: &firestore.Client{}}
	_, err := r.FindDraftsOf(ctx, "dummy", 1, 0, ArticleOrderFieldPublishedAt, OrderDirectionDesc)
	if !errors.Is(err, errInvalidOrderField) {
		t.Errorf("expected error should be %s but got %s", errInvalidOrderField, err)
	}
}
