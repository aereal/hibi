// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package dto

import (
	"github.com/aereal/hibi/api/models"
	"github.com/aereal/hibi/api/repository"
)

type ArticleConnection struct {
	Nodes      []models.Article    `json:"nodes"`
	PageInfo   *OffsetBasePageInfo `json:"pageInfo"`
	TotalCount int                 `json:"totalCount"`
}

type ArticleOrder struct {
	Field     repository.ArticleOrderField `json:"field"`
	Direction repository.OrderDirection    `json:"direction"`
}

type DraftConnection struct {
	Nodes      []*models.Draft     `json:"nodes"`
	PageInfo   *OffsetBasePageInfo `json:"pageInfo"`
	TotalCount int                 `json:"totalCount"`
}

type OffsetBasePageInfo struct {
	HasNextPage bool `json:"hasNextPage"`
	NextPage    *int `json:"nextPage"`
}

type PublishedArticleConnection struct {
	Nodes      []*models.PublishedArticle `json:"nodes"`
	PageInfo   *OffsetBasePageInfo        `json:"pageInfo"`
	TotalCount int                        `json:"totalCount"`
}
