package models

type Diary struct {
	ID   string
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
