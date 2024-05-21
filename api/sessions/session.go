package sessions

import (
	"context"
	"errors"
	"fmt"
	"guildhall/models/challenge"
	"guildhall/models/user"
	"net/http"
)

var (
	ErrorMissingSession        = errors.New("missing session")
	ErrorSessionNotFound       = errors.New("session not found")
	ErrorSessionUserNotFound   = errors.New("session user not found")
	ErrorContextMissingSession = errors.New("context missing session")
	ErrorUnauthorized          = errors.New("unauthorized request")
)

const ContextSessionKey = "Session"

type Session struct {
	ID   string
	User *user.User
}

func SessionFromRequest(r *http.Request) (*Session, error) {
	sessionID := r.Header.Get("X-Session-ID")
	if sessionID == "" {
		return nil, ErrorMissingSession
	}
	c, err := challenge.FindByID(sessionID)
	if err != nil {
		return nil, ErrorSessionNotFound
	}
	u, err := user.FindByID(c.UserID)
	if err != nil {
		return nil, ErrorSessionUserNotFound
	}
	return &Session{ID: sessionID, User: u}, nil
}

func SessionFromContext(ctx context.Context) (*Session, error) {
	session := ctx.Value(ContextSessionKey).(*Session)
	if session == nil {
		return nil, ErrorContextMissingSession
	}
	return session, nil
}

func ContextWithSession(ctx context.Context, session *Session) context.Context {
	return context.WithValue(ctx, ContextSessionKey, session)
}

type AuthenticatedMiddleware struct {
	handler http.Handler
}

func NewAuthenticatedMiddleware(h http.Handler) *AuthenticatedMiddleware {
	return &AuthenticatedMiddleware{handler: h}
}

func (h AuthenticatedMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	session, err := SessionFromRequest(r)
	if err != nil || session == nil {
		w.WriteHeader(http.StatusForbidden)
		fmt.Fprint(w, ErrorUnauthorized)
	}
	ctx := ContextWithSession(r.Context(), session)
	if h.handler != nil {
		h.handler.ServeHTTP(w, r.WithContext(ctx))
	}
}
