package dto

import (
	"time"

	"github.com/aereal/hibi/api/models"
)

type Draft struct {
	ID       string              `json:"id"`
	Title    *string             `json:"title"`
	Body     *models.ArticleBody `json:"body"`
	AuthorID string
}

func (Draft) IsArticle() {}

type PublishedArticle struct {
	ID          string              `json:"id"`
	Title       *string             `json:"title"`
	Body        *models.ArticleBody `json:"body"`
	PublishedAt time.Time           `json:"publishedAt"`
	AuthorID    string
}

func (PublishedArticle) IsArticle() {}
