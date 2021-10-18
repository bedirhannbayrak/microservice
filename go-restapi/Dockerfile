FROM golang:1.16-buster AS build

WORKDIR /app

# download the required Go dependencies
COPY go.mod ./
COPY go.sum ./
RUN go mod download
#COPY *.go ./
COPY . ./
EXPOSE 3000

RUN ls

RUN go build -o server .

ENTRYPOINT ["/app/server"]