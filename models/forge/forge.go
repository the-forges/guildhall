package forge

import (
	"fmt"
	"guildhall/db"

	"github.com/google/uuid"
)

type Forge struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func New() (*Forge, error) {
	id, err := uuid.NewRandom()
	return &Forge{ID: id.String()}, err
}

func FindAll() ([]Forge, error) {
	var forges []Forge
	rows, err := db.Instance().Query("SELECT id, name FROM forges")
	if err != nil {
		return forges, err
	}
	defer rows.Close()

	var forge Forge
	for rows.Next() {
		if err := rows.Scan(&forge.ID, &forge.Name); err != nil {
			return forges, err
		}
		forges = append(forges, forge)
	}
	if err := rows.Err(); err != nil {
		return forges, err
	}
	return forges, nil
}

func FindByID(id string) (*Forge, error) {
	forge := &Forge{ID: id}

	err := db.Instance().QueryRow(`
		SELECT * FROM forges
		WHERE id=$1
	`, id).Scan(&forge.ID, &forge.Name)
	if err != nil {
		return nil, err
	}
	return forge, nil
}

func (f *Forge) Create() error {
	res, err := db.Instance().Exec(`
		INSERT INTO forges (id, name)
		VALUES ($1, $2)
	`, f.ID, f.Name)
	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error creating forge: rows affected < 1")
	}
	return nil
}

func (f *Forge) Update() error {
	res, err := db.Instance().Exec(`
		UPDATE forges
		SET name=$2
		WHERE id=$1
	`, f.ID, f.Name)

	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error updating forge: rows affected < 1")
	}
	return nil
}

func (f *Forge) Delete() error {
	res, err := db.Instance().Exec(`
		DELETE FROM forges
		WHERE id=$1
	`, f.ID)

	if err != nil {
		return err
	}
	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count < 1 {
		return fmt.Errorf("error deleting forge: rows affected < 1")
	}
	return nil
}
