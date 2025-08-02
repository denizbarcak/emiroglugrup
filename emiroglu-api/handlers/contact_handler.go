package handlers

import (
	"context"
	"net/http"
	"time"

	"emiroglu-api/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ContactHandler struct {
	collection *mongo.Collection
}

func NewContactHandler(db *mongo.Database) *ContactHandler {
	return &ContactHandler{
		collection: db.Collection("contact_info"),
	}
}

func (h *ContactHandler) GetContactInfo(c *gin.Context) {
	var contactInfo models.ContactInfo
	err := h.collection.FindOne(context.Background(), bson.M{}).Decode(&contactInfo)
	
	if err == mongo.ErrNoDocuments {
		// Eğer kayıt yoksa varsayılan değerleri döndür
		contactInfo = models.ContactInfo{
			Email: "info@emiroglugrup.com",
			Phone: "+90 (XXX) XXX XX XX",
		}
		c.JSON(http.StatusOK, contactInfo)
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "İletişim bilgileri alınamadı"})
		return
	}

	c.JSON(http.StatusOK, contactInfo)
}

func (h *ContactHandler) UpdateContactInfo(c *gin.Context) {
	var input models.ContactInfo

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"email":     input.Email,
			"phone":     input.Phone,
			"updatedAt": time.Now(),
		},
	}

	opts := options.Update().SetUpsert(true)

	result, err := h.collection.UpdateOne(
		context.Background(),
		bson.M{},
		update,
		opts,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "İletişim bilgileri güncellenemedi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "İletişim bilgileri güncellendi", "modifiedCount": result.ModifiedCount})
}