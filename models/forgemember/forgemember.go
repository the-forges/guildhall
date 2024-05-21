package forgemember

import (
	"fmt"
	"guildhall/db"

	"github.com/google/uuid"
)

type ForgeMember struct {
	ID      string `json:"id"`
	ForgeID string `json:"forge_id"`
	UserID  string `json:"user_id"`
}

func New() (*ForgeMember, error) {
	id, err := uuid.NewRandom()
	return &ForgeMember{ID: id.String()}, err
}

func FindAllByForgeID(id string) ([]ForgeMember, error) {
	var forgeMembers []ForgeMember
	rows, err := db.Instance().Query(`
		SELECT id, forge_id, user_id FROM forge_members
		WHERE forge_id=$1
	`, id)
	if err != nil {
		return forgeMembers, err
	}
	defer rows.Close()

	var forgeMember ForgeMember
	for rows.Next() {
		if err := rows.Scan(&forgeMember.ID, &forgeMember.ForgeID, &forgeMember.UserID); err != nil {
			return forgeMembers, err
		}
		forgeMembers = append(forgeMembers, forgeMember)
	}
	if err := rows.Err(); err != nil {
		return forgeMembers, err
	}
	return forgeMembers, nil
}

func FindAllByUserID(id string) ([]ForgeMember, error) {
	var forgeMembers []ForgeMember
	rows, err := db.Instance().Query(`
		SELECT id, forge_id, user_id FROM forge_members
		WHERE user_id=$1
	`, id)
	if err != nil {
		return forgeMembers, err
	}
	defer rows.Close()

	var forgeMember ForgeMember
	for rows.Next() {
		if err := rows.Scan(&forgeMember.ID, &forgeMember.ForgeID, &forgeMember.UserID); err != nil {
			return forgeMembers, err
		}
		forgeMembers = append(forgeMembers, forgeMember)
	}
	if err := rows.Err(); err != nil {
		return forgeMembers, err
	}
	return forgeMembers, nil
}

func (f *ForgeMember) Create() error {
	res, err := db.Instance().Exec(`
		INSERT INTO forge_members (id, forge_id, user_id)
		VALUES ($1, $2, $3)
	`, f.ID, f.ForgeID, f.UserID)
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

func (f *ForgeMember) Delete() error {
	res, err := db.Instance().Exec(`
		DELETE FROM forge_members
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
		return fmt.Errorf("error deleting forge membership: rows affected < 1")
	}
	return nil
}
