// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package dto

import (
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
)

type ArticleConnection struct {
	Nodes      []*models.Article `json:"nodes"`
	PageInfo   *PageInfo         `json:"pageInfo"`
	TotalCount int               `json:"totalCount"`
}

type ArticleOrder struct {
	Field     repository.ArticleOrderField `json:"field"`
	Direction repository.OrderDirection    `json:"direction"`
}

type DiaryConnecion struct {
	Nodes      []*models.Diary `json:"nodes"`
	PageInfo   *PageInfo       `json:"pageInfo"`
	TotalCount int             `json:"totalCount"`
}

type PageInfo struct {
	EndCursor       *string `json:"endCursor"`
	HasNextPage     bool    `json:"hasNextPage"`
	HasPreviousPage bool    `json:"hasPreviousPage"`
	StartCursor     *string `json:"startCursor"`
}
