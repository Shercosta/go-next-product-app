package main

import (
	"fmt"
	"logic-go/handlers"
	"net/http"

	"github.com/go-chi/chi/v5"
)

var Port = "3003"

func main() {
	r := chi.NewRouter()

	r.Post("/calculate", handlers.Calculate)

	fmt.Println("Listening on port " + Port)
	http.ListenAndServe(":"+Port, r)
}
