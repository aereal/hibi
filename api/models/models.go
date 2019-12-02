package models

type Diary struct {
	Name string
}

type Article struct {
	ID    string
	Title *string
	Body  *ArticleBody
}

type ArticleBody struct {
	Markdown string
	HTML     string
}
