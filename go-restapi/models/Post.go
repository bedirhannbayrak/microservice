package models

import (
	"github.com/Kamva/mgm/v2"
)

type Post struct {
	mgm.DefaultModel `bson:",inline"`
	UserId           string `json:"user_id": `
	Title            string `json:"title" bson:"title"`
	Content          string `json:"content" bson:"content"`
}

func CreatePost(userId,title, content string) *Post {
	return &Post{
		UserId: userId,
		Title:   title,
		Content: content,
	}
}
