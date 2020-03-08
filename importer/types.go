package main

import (
	"encoding/json"
	"fmt"
	"net/url"
	"time"
)

type JsonableURL url.URL

func (u *JsonableURL) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	parsed, err := url.Parse(s)
	if err != nil {
		return err
	}
	*u = JsonableURL(*parsed)
	return nil
}

func (u JsonableURL) MarshalJSON() ([]byte, error) {
	q := ""
	if u.RawQuery != "" {
		q = "?" + u.RawQuery
	}
	frag := ""
	if u.Fragment != "" {
		frag = "#" + u.Fragment
	}
	s := fmt.Sprintf("%s://%s%s%s%s", u.Scheme, u.Host, u.Path, q, frag) // opaque?
	return json.Marshal(s)
}

type ISO8601DateTime time.Time

var (
	layoutISO8601 = time.RFC3339
	layoutMT      = "01/02/2006 15:04:05"
)

func (t *ISO8601DateTime) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}
	parsed, err := parseISO8601InLocation(s, time.Local)
	if err != nil {
		return err
	}
	*t = parsed
	return nil
}

func (t ISO8601DateTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Time(t).Format(layoutISO8601))
}

func parseISO8601InLocation(s string, loc *time.Location) (ISO8601DateTime, error) {
	parsed, err := time.ParseInLocation(layoutISO8601, s, loc)
	if err != nil {
		return ISO8601DateTime{}, err
	}
	return ISO8601DateTime(parsed), nil
}

func parseMTDateTime(s string, loc *time.Location) (time.Time, error) {
	return time.ParseInLocation(layoutMT, s, loc)
}
