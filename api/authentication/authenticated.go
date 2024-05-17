package authentication

import (
	"encoding/json"
	"fmt"
	"guildhall/models/challenge"
	"guildhall/models/user"
	"net/http"
)

type AuthenticatedResponse struct {
	Error string     `json:"error,omitempty"`
	User  *user.User `json:"user,omitempty"`
}

type Authenticated struct{}

func NewAuthenticated() *Authenticated {
	return &Authenticated{}
}

func (a Authenticated) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("challenge")

	c, err := challenge.FindByID(code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(AuthenticatedResponse{Error: fmt.Sprintf("Challenge code not found: %s", code)})
		return
	}

	if c.UserID == "" {
		_ = json.NewEncoder(w).Encode(AuthenticatedResponse{})
		return
	}

	u, err := user.FindByID(c.UserID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: "User not found"})
		return
	}
	_ = json.NewEncoder(w).Encode(AuthenticatedResponse{User: u})
}
