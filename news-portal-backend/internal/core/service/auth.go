package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"
)

type AuthService struct {
	repo      port.OwnerRepository
	jwtSecret string
}

func NewAuthService(repo port.OwnerRepository, jwtSecret string) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	owner, err := s.repo.GetOwnerByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if owner == nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(owner.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": owner.ID,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	})

	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) Register(ctx context.Context, name, nameEn, email, password string) (*domain.Owner, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return s.repo.CreateOwner(ctx, name, nameEn, email, string(hashedPassword))
}

func (s *AuthService) ChangePassword(ctx context.Context, id uuid.UUID, oldPassword, newPassword string) error {
	owner, err := s.repo.GetOwnerByID(ctx, id)
	if err != nil {
		return err
	}
	if owner == nil {
		return errors.New("user not found")
	}

	// Verify old password
	err = bcrypt.CompareHashAndPassword([]byte(owner.Password), []byte(oldPassword))
	if err != nil {
		return errors.New("invalid old password")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.repo.UpdateOwnerPassword(ctx, id, string(hashedPassword))
}

func (s *AuthService) UpdateUser(ctx context.Context, id uuid.UUID, name, nameEn, email, password string, profileImage *string, hideProfileImage bool) error {
	owner, err := s.repo.GetOwnerByID(ctx, id)
	if err != nil {
		return err
	}
	if owner == nil {
		return errors.New("user not found")
	}

	owner.Name = name
	owner.NameEn = nameEn
	owner.Email = email
	owner.ProfileImage = profileImage
	owner.HideProfileImage = hideProfileImage

	if password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		owner.Password = string(hashedPassword)
	}

	return s.repo.UpdateOwner(ctx, owner)
}

func (s *AuthService) ListUsers(ctx context.Context) ([]*domain.Owner, error) {
	return s.repo.ListOwners(ctx)
}

func (s *AuthService) GetMe(ctx context.Context, id uuid.UUID) (*domain.Owner, error) {
	return s.repo.GetOwnerByID(ctx, id)
}
