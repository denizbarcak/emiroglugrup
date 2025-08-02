package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ContactInfo struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string            `bson:"email" json:"email"`
	Phone     string            `bson:"phone" json:"phone"`
	UpdatedAt time.Time         `bson:"updatedAt" json:"updatedAt"`
}