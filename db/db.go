package db

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

var instance *sql.DB

func Open() (*sql.DB, error) {
	conn, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, err
	}
	instance = conn
	return instance, nil
}

func Instance() *sql.DB {
	return instance
}
