package models

import "time"

type Diary struct {
	ID   string
	Name string
}

type Article struct {
	ID          string
	Title       *string
	Body        *ArticleBody
	PublishedAt time.Time
}

type ArticleBody struct {
	Markdown string
}
