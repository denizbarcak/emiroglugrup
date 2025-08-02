package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Catalog struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string            `bson:"name" json:"name"`
	Description string            `bson:"description" json:"description"`
	FileURL     string            `bson:"fileUrl" json:"fileUrl"`
	ImageURL    string            `bson:"imageUrl" json:"imageUrl"`
	CreatedAt   time.Time         `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time         `bson:"updatedAt" json:"updatedAt"`
}