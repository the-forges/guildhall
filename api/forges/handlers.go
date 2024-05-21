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

func NewFindAllHandler() *FindAllHandler {
	return &FindAllHandler{}
}

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

func NewFindHandler() *FindHandler {
	return &FindHandler{}
}

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

type CreateResponse struct {
	Error string       `json:"error,omitempty"`
	Forge *forge.Forge `json:"forge,omitempty"`
}

type CreateHandler struct{}

func NewCreateHandler() *CreateHandler {
	return &CreateHandler{}
}

func (h CreateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	forge, err := forge.New()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}
	if err := forge.Create(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}
	_ = json.NewEncoder(w).Encode(CreateResponse{Forge: forge})
}
