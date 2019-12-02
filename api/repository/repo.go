package repository

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/aereal/hibi/api/models"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func New(client *firestore.Client) (*Repository, error) {
	return &Repository{client: client}, nil
}

type Repository struct {
	client *firestore.Client
}

func (r *Repository) FindDiary(ctx context.Context, id string) (*models.Diary, error) {
	snapshot, err := r.client.Collection("diaries").Doc(id).Get(ctx)
	if status.Code(err) == codes.NotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var dto diaryDTO
	if err := snapshot.DataTo(&dto); err != nil {
		return nil, fmt.Errorf("failed to populate snapshot as diary: %w", err)
	}
	diary := &models.Diary{
		Name: dto.Name,
		ID:   snapshot.Ref.ID,
	}
	return diary, nil
}

type diaryDTO struct {
	Name string
}
