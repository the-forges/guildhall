package main

import (
	"flag"
	"fmt"
	"guildhall/api/authentication"
	"guildhall/db"
	"log"
	"net/http"
)

var (
	port int
)

func init() {
	flag.IntVar(&port, "port", 8000, "port to listen on")
	flag.Parse()
}

func main() {
	if _, err := db.Open(); err != nil {
		log.Fatal(err)
	}

	http.Handle("GET /api/preauth", authentication.NewPreAuth())
	http.Handle("GET /api/authenticated/{challenge}", authentication.NewAuthenticated())
	http.Handle("POST /api/authenticate/{challenge}", authentication.NewAuthenticate())
	http.Handle("/", http.FileServer(http.Dir("web/dist")))

	log.Printf("Server listening on port %d", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
