package repository

import (
	"cloud.google.com/go/firestore"
)

func New(client *firestore.Client) (*Repository, error) {
	return &Repository{client: client}, nil
}

type Repository struct {
	client *firestore.Client
}
