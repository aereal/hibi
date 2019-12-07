package models

import "time"

type Diary struct {
	ID      string
	Name    string
	OwnerID string
}

type Article struct {
	ID          string
	Title       *string
	Body        *ArticleBody
	PublishedAt time.Time
	AuthorID    string
}

type ArticleBody struct {
	Markdown string
}

type User struct {
	ID   string
	Name string
}

func (u *User) IsGuest() bool {
	return u.ID == guestID
}

var (
	guestID = "**guest**"
	GUEST   = &User{ID: guestID, Name: "GUEST"}
)
