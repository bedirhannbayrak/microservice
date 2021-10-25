package models

import (
	"github.com/Kamva/mgm/v2"
)

type Post struct {
	mgm.DefaultModel `bson:",inline"`
	UserId           string
	Title            string
	Content          string
}

func CreatePost(userId,title, content string) *Post {
	return &Post{
		UserId: userId,
		Title:   title,
		Content: content,
	}
}
