package main

import (
	"github.com/Kamva/mgm/v2"
	"github.com/bedirhannbayrak/blog/controllers"
	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

func init() {
	connectionString := os.Getenv("MONGODB_CONNECTION_STRING")
	if len(connectionString) == 0 {
		connectionString = "mongodb://localhost:27017"
	}

	err := mgm.SetDefaultConfig(nil, "blog", options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	//go rabbitmq.Consumer()
	//rabbitmq.SendMessage("test")
	//rabbitmq.RpcStart(nil)
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/api/posts", controllers.GetAllPosts)
	app.Get("/api/posts/:id", controllers.GetPostByID)
	app.Post("/api/posts", controllers.CreatePost)
	app.Post("/api/login", func(ctx *fiber.Ctx) {
		controllers.UserLogin(ctx,"login")
	})
	app.Post("/api/register", func(ctx *fiber.Ctx) {
		controllers.UserLogin(ctx,"register")
	})

	app.Listen(3000)

}
