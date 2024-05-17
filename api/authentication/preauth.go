package authentication

import (
	"encoding/json"
	"guildhall/models/challenge"
	"net/http"
)

type PreAuthResponse struct {
	Error     string `json:"error,omitempty"`
	Challenge string `json:"challenge,omitempty"`
}

type PreAuth struct{}

func (p PreAuth) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	challenge, err := challenge.New()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(PreAuthResponse{Error: "Internal Server Error"})
		return
	}

	if err := challenge.Create(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(PreAuthResponse{Error: err.Error()})
		return
	}

	_ = json.NewEncoder(w).Encode(PreAuthResponse{Challenge: challenge.ID})
}

func NewPreAuth() *PreAuth {
	return &PreAuth{}
}
