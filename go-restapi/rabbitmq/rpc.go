package rabbitmq

import (
	"encoding/json"
	"github.com/gofiber/fiber"
	"log"
	"math/rand"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func randomString(l int) string {
	bytes := make([]byte, l)
	for i := 0; i < l; i++ {
		bytes[i] = byte(randInt(65, 90))
	}
	return string(bytes)
}

func randInt(min int, max int) int {
	return min + rand.Intn(max-min)
}

func sendUserReq(req UserReq, ctx *fiber.Ctx) (res int, err error) {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	FailOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	FailOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		true,  // exclusive
		false, // noWait
		nil,   // arguments
	)
	FailOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	FailOnError(err, "Failed to register a consumer")

	corrId := randomString(32)

	jsonBody,err:= json.Marshal(req)
	FailOnError(err, "Failed to parse request body")
	//bytes:= []byte(jsonBody)
	log.Printf(" [x] Requesting for user : %s", string(jsonBody[:]))
	err = ch.Publish(
		"",          // exchange
		"rpc_queue", // routing key
		false,       // mandatory
		false,       // immediate
		amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: corrId,
			ReplyTo:       q.Name,
			Body:          jsonBody,
		})
	FailOnError(err, "Failed to publish a message")

	for d := range msgs {
		if corrId == d.CorrelationId {
			log.Printf("Response : %s",d.Body)
			var userRes UserRes
			err = json.Unmarshal(d.Body, &userRes)

			FailOnError(err, "Failed to convert request body ")
			ctx.JSON(userRes)
			break
		}
	}
	return
}

func RpcStart(req UserReq, ctx *fiber.Ctx) (int, error) {
	rand.Seed(time.Now().UTC().UnixNano())

	res, err := sendUserReq(req,ctx)
	FailOnError(err, "Failed to handle RPC request")

	log.Printf(" [.] Got %d", res)
	return res,err
}

type UserReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	RequestType string `json:"requestType"`
}

type  UserRes struct {
	Username string `json:"username,omitempty"`
	Id int `json:"id,omitempty"`
	Status string `json:"status"`
}

func FailOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}