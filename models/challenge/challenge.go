package challenge

import (
	"fmt"
	"guildhall/db"

	"github.com/google/uuid"
)

type Challenge struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
}

func New() (*Challenge, error) {
	challenge, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}
	return &Challenge{ID: challenge.String()}, nil
}

func FindByID(id string) (*Challenge, error) {
	challenge := &Challenge{ID: id}

	err := db.Instance().QueryRow(`
		SELECT id, user_id FROM challenges
		WHERE id=$1
	`, id).Scan(&challenge.ID, &challenge.UserID)
	if err != nil {
		return nil, err
	}
	return challenge, nil
}

func (c *Challenge) Create() error {
	res, err := db.Instance().Exec(`
		INSERT INTO challenges (id, user_id)
		VALUES ($1, $2)
	`, c.ID, c.UserID)

	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error creating challenge: rows affected < 1")
	}
	return nil
}

func (c *Challenge) Update() error {
	res, err := db.Instance().Exec(`
		UPDATE challenges
		SET user_id=$2
		WHERE id=$1
	`, c.ID, c.UserID)

	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error updating challenge: rows affected < 1")
	}
	return nil
}
