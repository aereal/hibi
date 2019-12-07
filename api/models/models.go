package models

import (
	"fmt"
	"io"
	"strconv"
	"time"
)

type Diary struct {
	ID      string
	Name    string
	OwnerID string
}

func (d *Diary) CanPostArticle(user *User) bool {
	return user.ID == d.OwnerID
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
