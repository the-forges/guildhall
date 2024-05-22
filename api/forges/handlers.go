package forges

import (
	"encoding/json"
	"fmt"
	"guildhall/api/sessions"
	"guildhall/models/forge"
	"guildhall/models/forgemember"
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
	session, err := sessions.SessionFromContext(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(FindAllResponse{Error: err.Error()})
		return
	}
	forges, err := forge.FindAll(session.User.ID)
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

type CreateRequest struct {
	Name string `json:"name"`
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
	var req CreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	session, err := sessions.SessionFromContext(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	f, err := forge.New()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	f.Name = req.Name

	if err := f.Create(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	fm, err := forgemember.New()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	fm.ForgeID = f.ID
	fm.UserID = session.User.ID
	fm.Role = forgemember.RoleOwner

	if err := fm.Create(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(CreateResponse{Error: err.Error()})
		return
	}

	_ = json.NewEncoder(w).Encode(CreateResponse{Forge: f})
}
