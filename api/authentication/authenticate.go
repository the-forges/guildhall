package authentication

import (
	"encoding/json"
	"fmt"
	"guildhall/models/challenge"
	"guildhall/models/user"
	"net/http"
	"os"
)

type AuthenticateRequest struct {
	PublicKey string     `json:"public_key"`
	User      *user.User `json:"user"`
}

type AuthenticateResponse struct {
	Error string     `json:"error,omitempty"`
	User  *user.User `json:"user,omitempty"`
}

type Authenticate struct{}

func NewAuthenticate() *Authenticate {
	return &Authenticate{}
}

func (a Authenticate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("challenge")

	c, err := challenge.FindByID(code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: fmt.Sprintf("Challenge code not found: %s", code)})
		return
	}

	var req AuthenticateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: fmt.Sprintf("Bad json body sent: %s", err.Error())})
		return
	}

	if c.UserID != "" && c.UserID != req.PublicKey {
		fmt.Fprintf(os.Stderr, "[REDFLAG] Authenticate tried reusing a already used challenge with a new public key: {code: %s, public_key: %s}", code, req.PublicKey)

		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: "Missing or bad challenge code sent"})
		return
	}

	u, err := user.FindByIDOrCreate(req.PublicKey, req.User)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: fmt.Sprintf("Internal server error: %s", err.Error())})
		return
	}

	c.UserID = req.PublicKey
	if err := c.Update(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(AuthenticateResponse{Error: fmt.Sprintf("Internal server error: %s", err.Error())})
		return
	}
	_ = json.NewEncoder(w).Encode(AuthenticateResponse{User: u})
}
