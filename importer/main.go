package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aereal/hibi/api/models"
	"github.com/soh335/mtexport/ast"
	"github.com/soh335/mtexport/parser"
)

func main() {
	if err := run(os.Args); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}

var (
	StatusPublic = "Publish"
	StatusDraft  = "Draft"
)

type Entry struct {
	Author        string
	Title         string
	Basename      string
	Status        string
	AllowComments bool
	ConvertBreaks bool
	Date          ISO8601DateTime
	Image         string
	Categorires   []string
	Body          string
	URL           string `json:"omitempty"`
	Email         string `json:"omitempty"`
}

func parseEntryStatement(e *Entry, stmt *ast.EntryStmt) error {
	for _, stmt := range stmt.SectionStmts {
		switch t := stmt.(type) {
		case *ast.MultilineSectionStmt:
			if err := parseMultilineSectionStatement(e, t); err != nil {
				return fmt.Errorf("failed to parse multiline section statement: %w", err)
			}
		case *ast.NormalSectionStmt:
			if err := parseNormalSectionStatement(e, t); err != nil {
				return fmt.Errorf("failed to parse normal section statement: %w", err)
			}
		}
	}
	return nil
}

func parseMultilineSectionStatement(e *Entry, stmt *ast.MultilineSectionStmt) error {
	if stmt.Key == "BODY" {
		e.Body = strings.TrimSpace(stmt.Body)
	}
	for _, stmt := range stmt.FieldStmts {
		if err := parseFieldStatement(e, stmt.(*ast.FieldStmt)); err != nil {
			return fmt.Errorf("failed to parse field statement: %w", err)
		}
	}
	return nil
}

func parseNormalSectionStatement(e *Entry, stmt *ast.NormalSectionStmt) error {
	for _, stmt := range stmt.FieldStmts {
		if err := parseFieldStatement(e, stmt.(*ast.FieldStmt)); err != nil {
			return err
		}
	}
	return nil
}

func parseFieldStatement(e *Entry, stmt *ast.FieldStmt) error {
	value := strings.TrimSpace(stmt.Value)
	switch stmt.Key {
	case "ALLOW COMMENTS":
		e.AllowComments = value == "1"
	case "CONVERT BREAKS":
		e.ConvertBreaks = value == "1"
	case "IMAGE":
		_, err := url.Parse(value)
		if err != nil {
			return fmt.Errorf("failed to parse field as URL: %w", err)
		}
		e.Image = value
	case "CATEGORY":
		e.Categorires = append(e.Categorires, value)
	case "DATE":
		t, err := parseMTDateTime(value, time.Local)
		if err != nil {
			return fmt.Errorf("failed to parse date: %w", err)
		}
		e.Date = ISO8601DateTime(t)
	case "AUTHOR":
		e.Author = value
	case "TITLE":
		e.Title = value
	case "BASENAME":
		e.Basename = value
	case "STATUS":
		e.Status = value
	case "URL":
		e.URL = value
	case "EMAIL":
		e.Email = value
	default:
		return fmt.Errorf("unknown field: %q", stmt.Key)
	}
	return nil
}

func parseStatements(w io.Writer, stmts []ast.Stmt) ([]*Entry, error) {
	entries := make([]*Entry, len(stmts))
	for i, stmt := range stmts {
		e := &Entry{Categorires: []string{}}
		switch t := stmt.(type) {
		case *ast.EntryStmt:
			if err := parseEntryStatement(e, t); err != nil {
				return nil, err
			}
		case *ast.MultilineSectionStmt:
			if err := parseMultilineSectionStatement(e, t); err != nil {
				return nil, err
			}
		case *ast.NormalSectionStmt:
			if err := parseNormalSectionStatement(e, t); err != nil {
				return nil, err
			}
		case *ast.FieldStmt:
			if err := parseFieldStatement(e, t); err != nil {
				return nil, err
			}
		default:
		}
		entries[i] = e
	}
	return entries, nil
}

func run(argv []string) error {
	if len(argv) < 2 {
		return fmt.Errorf("IMPORT_FILE_PATH required")
	}
	importFilePath := argv[1]
	f, err := os.Open(importFilePath)
	if err != nil {
		return fmt.Errorf("cannot open import file %s: %w", importFilePath, err)
	}
	stmts, err := parser.Parse(f, []string{"IMAGE", "URL"})
	if err != nil {
		return fmt.Errorf("failed to parse: %w", err)
	}
	log.Printf("%d statements found", len(stmts))
	entries, err := parseStatements(os.Stdout, stmts)
	if err != nil {
		return fmt.Errorf("failed to parse statements: %w", err)
	}
	if os.Getenv("DEBUG") != "" {
		if err := json.NewEncoder(os.Stdout).Encode(entries); err != nil {
			return fmt.Errorf("failed to encode as JSON: %w", err)
		}
	}
	publics, drafts, err := convertExportDataToModels(entries)
	if err != nil {
		return fmt.Errorf("failed to convert export data: %w", err)
	}
	log.Printf("total %d entries; %d published articles; %d drafts", len(publics)+len(drafts), len(publics), len(drafts))
	return nil
}

func convertExportDataToModels(entries []*Entry) ([]*models.PublishedArticle, []*models.Draft, error) {
	articles := []*models.PublishedArticle{}
	drafts := []*models.Draft{}
	for _, entry := range entries {
		switch entry.Status {
		case StatusPublic:
			body := &models.ArticleBody{}
			body.SetHTML(entry.Body)
			articles = append(articles, &models.PublishedArticle{
				Title:       &entry.Title,
				Body:        body,
				PublishedAt: time.Time(entry.Date),
				CreatedAt:   time.Time(entry.Date),
				UpdatedAt:   time.Time(entry.Date),
			})
		case StatusDraft:
			body := &models.ArticleBody{}
			body.SetHTML(entry.Body)
			drafts = append(drafts, &models.Draft{
				Title:     &entry.Title,
				Body:      body,
				CreatedAt: time.Time(entry.Date),
				UpdatedAt: time.Time(entry.Date),
			})
		default:
			return nil, nil, fmt.Errorf("unkonwn status: %q", entry.Status)
		}
	}

	return articles, drafts, nil
}
