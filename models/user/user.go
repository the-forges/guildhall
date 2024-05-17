package user

import (
	"database/sql"
	"errors"
	"fmt"
	"guildhall/db"
)

type User struct {
	ID          string `json:"id"`
	DisplayName string `json:"display_name"`
}

func New() (*User, error) {
	return &User{}, nil
}

func FindByID(id string) (*User, error) {
	user := &User{ID: id}
	if err := db.Instance().QueryRow(`
		SELECT id, display_name FROM users
		WHERE id=$1
	`, id).Scan(&user.ID, &user.DisplayName); err != nil {
		return nil, err
	}
	return user, nil
}

func (u *User) Create() error {
	res, err := db.Instance().Exec(`
		INSERT INTO users (id, display_name)
		VALUES ($1, $2)
	`, u.ID, u.DisplayName)

	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error creating user: rows affected < 1")
	}
	return nil
}

func FindByIDOrCreate(id string, newUser *User) (*User, error) {
	if newUser == nil {
		newUser, _ = New()
	}
	newUser.ID = id

	user, err := FindByID(id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			if err := newUser.Create(); err != nil {
				return nil, err
			}
			return newUser, nil
		}
		return nil, err
	}
	return user, nil
}
