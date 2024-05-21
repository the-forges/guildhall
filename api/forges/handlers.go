package forges

import (
	"encoding/json"
	"fmt"
	"guildhall/models/forge"
	"net/http"
)

type FindAllResponse struct {
	Error  string        `json:"error,omitempty"`
	Forges []forge.Forge `json:"forges,omitempty"`
}

type FindAllHandler struct{}

func (h FindAllHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	forges, err := forge.FindAll()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(FindAllResponse{Error: err.Error()})
		return
	}
	_ = json.NewEncoder(w).Encode(FindAllResponse{Forges: forges})
}

type FindResponse struct {
	Error string       `json:"error,omitempty"`
	Forge *forge.Forge `json:"forge,omitempty"`
}

type FindHandler struct{}

func (h FindHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	forge, err := forge.FindByID(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(FindResponse{Error: fmt.Sprintf("Forge not found: %s", err.Error())})
		return
	}
	_ = json.NewEncoder(w).Encode(FindResponse{Forge: forge})
}
