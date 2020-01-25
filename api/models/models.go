package models

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"gopkg.in/russross/blackfriday.v2"
)

type Diary struct {
	ID      string
	Name    string
	OwnerID string
}

func (d *Diary) CanPostArticle(user *User) bool {
	return user.ID == d.OwnerID
}

func (d *Diary) CanUpdateSettings(user *User) bool {
	return user.ID == d.OwnerID
}

type PublishState string

const (
	PublishStatePublished PublishState = "PUBLISHED"
	PublishStateDraft     PublishState = "DRAFT"
)

var AllPublishState = []PublishState{
	PublishStatePublished,
	PublishStateDraft,
}

var availableNextStates = map[PublishState][]PublishState{
	PublishStateDraft: []PublishState{PublishStatePublished},
}

func (s PublishState) CanChangeTo(next PublishState) bool {
	if s == next {
		return true
	}
	candidates := availableNextStates[s]
	for _, candidate := range candidates {
		if candidate == next {
			return true
		}
	}
	return false
}

func (e PublishState) IsValid() bool {
	switch e {
	case PublishStatePublished, PublishStateDraft:
		return true
	}
	return false
}

func (e PublishState) String() string {
	return string(e)
}

func (e *PublishState) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = PublishState(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid PublishState", str)
	}
	return nil
}

func (e PublishState) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type Article interface {
	GetID() string
	GetTitle() *string
	GetBody() *ArticleBody
	GetAuthorID() string
}

type PublishedArticle struct {
	ID          string
	Title       *string
	Body        *ArticleBody
	PublishedAt time.Time
	AuthorID    string
}

func (PublishedArticle) IsArticle() {}

func (a *PublishedArticle) GetID() string {
	return a.ID
}

func (a *PublishedArticle) GetTitle() *string {
	return a.Title
}

func (a *PublishedArticle) GetBody() *ArticleBody {
	return a.Body
}

func (a *PublishedArticle) GetAuthorID() string {
	return a.AuthorID
}

type Draft struct {
	ID       string
	Title    *string
	Body     *ArticleBody
	AuthorID string
}

func (Draft) IsArticle() {}

func (a *Draft) GetID() string {
	return a.ID
}

func (a *Draft) GetTitle() *string {
	return a.Title
}

func (a *Draft) GetBody() *ArticleBody {
	return a.Body
}

func (a *Draft) GetAuthorID() string {
	return a.AuthorID
}

type ArticleBody struct {
	Markdown string
	html     string
}

func (b *ArticleBody) SetHTML(html string) {
	b.html = html
}

func (b *ArticleBody) HTML() string {
	if b.Markdown != "" {
		rendered := blackfriday.Run([]byte(b.Markdown))
		return string(rendered)
	}
	return b.html
}

type User struct {
	ID   string
	Name string
}

func (u *User) Role() Role {
	if u.ID == guestID {
		return RoleGuest
	}
	return RoleAdmin
}

func (u *User) IsGuest() bool {
	return u.Role() == RoleGuest
}

var (
	guestID = "**guest**"
	GUEST   = &User{ID: guestID, Name: "GUEST"}
)

type Role int

const (
	_              = iota
	RoleGuest Role = 1 << iota
	RoleAdmin
)

func (r Role) HasPrivilegeOf(other Role) bool {
	return r >= other
}

func (r Role) IsValid() bool {
	switch r {
	case RoleAdmin, RoleGuest:
		return true
	}
	return false
}

func (r Role) String() string {
	switch r {
	case RoleAdmin:
		return "ADMIN"
	case RoleGuest:
		return "GUEST"
	default:
		return "UNKNOWN"
	}
}

func (e *Role) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	switch str {
	case "ADMIN":
		*e = RoleAdmin
	case "GUEST":
		*e = RoleGuest
	}
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Role", str)
	}
	return nil
}

func (e Role) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
