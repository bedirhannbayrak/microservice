package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/Kamva/mgm/v2"
	"github.com/bedirhannbayrak/blog/models"
	"github.com/bedirhannbayrak/blog/rabbitmq"
	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/bson"
)

func GetAllPosts(ctx *fiber.Ctx) {
	collection := mgm.Coll(&models.Post{})
	posts := []models.Post{}

	fmt.Println("test from controller create post")

	err := collection.SimpleFind(&posts, bson.D{})
	if err != nil {
		ctx.Status(500).JSON(fiber.Map{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(fiber.Map{
		"ok":    true,
		"posts": posts,
	})
	return
}

func GetPostByID(ctx *fiber.Ctx) {
	id := ctx.Params("id")

	post := &models.Post{}
	collection := mgm.Coll(post)

	err := collection.FindByID(id, post)
	if err != nil {
		ctx.Status(404).JSON(fiber.Map{
			"ok":    false,
			"error": "Post not found.",
		})
	}

	ctx.JSON(fiber.Map{
		"ok":   true,
		"post": post,
	})
}

func CreatePost(ctx *fiber.Ctx) {
	params := new(struct {
		UserId string `json:"user_id"`
		Title   string `json:"title"`
		Content string `json:"content"`
		SocketId string `json:"socket_id"`
	})

	ctx.BodyParser(&params)

	post := models.CreatePost(params.UserId,params.Title, params.Content)

	err := mgm.Coll(post).Create(post)
	if err != nil {
		ctx.Status(500).JSON(fiber.Map{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}
	msg,_:= json.Marshal(PostReq{params.UserId,params.Title,params.Content,params.SocketId})
	rabbitmq.SendMessage([]byte(msg))
	ctx.JSON(fiber.Map{
		"ok":   true,
		"post": post,
	})

}

func UserLogin(ctx *fiber.Ctx,requestType string) {
	params := new(struct {
		Username string
		Password   string
	})

	ctx.BodyParser(&params)
	userReq :=rabbitmq.UserReq{Username: params.Username, Password: params.Password, RequestType: requestType}
	rabbitmq.RpcStart(userReq,ctx)

}

type PostReq struct {
UserId string `json:"user_id"`
Title   string `json:"title"`
Content string `json:"content"`
SocketId string `json:"socket_id"`
}