package handlers

import (
	"context"
	"emiroglu-api/models"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CatalogHandler struct {
	db *mongo.Database
}

func NewCatalogHandler(db *mongo.Database) *CatalogHandler {
	return &CatalogHandler{db: db}
}

// Katalog listesini getir
func (h *CatalogHandler) GetCatalogs(c *gin.Context) {
	collection := h.db.Collection("catalogs")
	
	catalogs := []models.Catalog{}
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Kataloglar getirilemedi"})
		return
	}
	defer cursor.Close(context.Background())

	if err := cursor.All(context.Background(), &catalogs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Kataloglar getirilemedi"})
		return
	}

	c.JSON(http.StatusOK, catalogs)
}

// Yeni katalog ekle
func (h *CatalogHandler) CreateCatalog(c *gin.Context) {
	uploadPath := os.Getenv("UPLOAD_PATH")
	if uploadPath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload path not configured"})
		return
	}

	// Dizinlerin varlığını kontrol et
	pdfPath := filepath.Join(uploadPath, "catalogs-pdf")
	imagePath := filepath.Join(uploadPath, "catalog-images")
	
	if err := os.MkdirAll(pdfPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PDF dizini oluşturulamadı"})
		return
	}
	
	if err := os.MkdirAll(imagePath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Görsel dizini oluşturulamadı"})
		return
	}

	// PDF dosyası yükleme
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PDF dosyası gerekli"})
		return
	}

	// PDF dosya uzantısı kontrolü
	if filepath.Ext(file.Filename) != ".pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sadece PDF dosyaları kabul edilir"})
		return
	}

	// PDF dosyasını kaydet
	filename := primitive.NewObjectID().Hex() + ".pdf"
	pdfFilePath := filepath.Join(pdfPath, filename)
	if err := c.SaveUploadedFile(file, pdfFilePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PDF dosyası kaydedilemedi"})
		return
	}

	// Görsel yükleme
	var imageFilename string
	image, err := c.FormFile("image")
	if err == nil {
		// Görsel uzantısı kontrolü
		ext := filepath.Ext(image.Filename)
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Sadece JPG ve PNG görseller kabul edilir"})
			return
		}

		// Görseli kaydet
		imageFilename = primitive.NewObjectID().Hex() + ext
		imageFilePath := filepath.Join(imagePath, imageFilename)
		if err := c.SaveUploadedFile(image, imageFilePath); err != nil {
			println("Görsel kaydetme hatası:", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Görsel kaydedilemedi"})
			return
		}
		println("Görsel başarıyla kaydedildi:", imageFilePath)
	}

	// Katalog bilgilerini al
	name := c.PostForm("name")
	description := c.PostForm("description")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Katalog adı gerekli"})
		return
	}

	// Yeni katalog oluştur
	catalog := models.Catalog{
		ID:          primitive.NewObjectID(),
		Name:        name,
		Description: description,
		FileURL:     "/assets/catalogs-pdf/" + filename,
		ImageURL:    func() string {
			if imageFilename != "" {
				return "/assets/catalog-images/" + imageFilename
			}
			return ""
		}(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Veritabanına kaydet
	collection := h.db.Collection("catalogs")
	_, err = collection.InsertOne(context.Background(), catalog)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Katalog kaydedilemedi"})
		return
	}

	c.JSON(http.StatusCreated, catalog)
}

// Tekil katalog getir
func (h *CatalogHandler) GetCatalog(c *gin.Context) {
	id := c.Param("id")
	
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz ID"})
		return
	}

	collection := h.db.Collection("catalogs")
	
	var catalog models.Catalog
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&catalog)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Katalog bulunamadı"})
		return
	}

	c.JSON(http.StatusOK, catalog)
}

// Katalog güncelle
func (h *CatalogHandler) UpdateCatalog(c *gin.Context) {
	uploadPath := os.Getenv("UPLOAD_PATH")
	if uploadPath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload path not configured"})
		return
	}

	id := c.Param("id")
	
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz ID"})
		return
	}

	collection := h.db.Collection("catalogs")
	
	// Mevcut kataloğu bul
	var existingCatalog models.Catalog
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&existingCatalog)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Katalog bulunamadı"})
		return
	}

	// Form verilerini al
	name := c.PostForm("name")
	description := c.PostForm("description")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Katalog adı gerekli"})
		return
	}

	// Güncelleme için kullanılacak veriyi hazırla
	update := bson.M{
		"name": name,
		"description": description,
		"updatedAt": time.Now(),
	}

	// PDF dosyası yüklendiyse
	file, err := c.FormFile("file")
	if err == nil {
		// PDF dosya uzantısı kontrolü
		if filepath.Ext(file.Filename) != ".pdf" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Sadece PDF dosyaları kabul edilir"})
			return
		}

		// Eski PDF dosyasını sil
		if existingCatalog.FileURL != "" {
			oldPdfPath := filepath.Join(uploadPath, "catalogs-pdf", filepath.Base(existingCatalog.FileURL))
			if err := os.Remove(oldPdfPath); err != nil {
				println("Eski PDF silme hatası:", err.Error())
			}
		}

		// Yeni PDF dosyasını kaydet
		filename := primitive.NewObjectID().Hex() + ".pdf"
		newPdfPath := filepath.Join(uploadPath, "catalogs-pdf", filename)
		if err := c.SaveUploadedFile(file, newPdfPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "PDF dosyası kaydedilemedi"})
			return
		}

		update["fileUrl"] = "/assets/catalogs-pdf/" + filename
	}

	// Görsel yüklendiyse
	image, err := c.FormFile("image")
	if err == nil {
		// Görsel uzantısı kontrolü
		ext := filepath.Ext(image.Filename)
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Sadece JPG ve PNG görseller kabul edilir"})
			return
		}

		// Eski görseli sil
		if existingCatalog.ImageURL != "" {
			oldImagePath := filepath.Join(uploadPath, "catalog-images", filepath.Base(existingCatalog.ImageURL))
			if err := os.Remove(oldImagePath); err != nil {
				println("Eski görsel silme hatası:", err.Error())
			}
		}

		// Yeni görseli kaydet
		imageFilename := primitive.NewObjectID().Hex() + ext
		newImagePath := filepath.Join(uploadPath, "catalog-images", imageFilename)
		if err := c.SaveUploadedFile(image, newImagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Görsel kaydedilemedi"})
			return
		}

		update["imageUrl"] = "/assets/catalog-images/" + imageFilename
	}

	// Veritabanında güncelle
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": update},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Katalog güncellenemedi"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Katalog bulunamadı"})
		return
	}

	// Güncellenmiş kataloğu getir
	var updatedCatalog models.Catalog
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&updatedCatalog)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Güncellenmiş katalog getirilemedi"})
		return
	}

	c.JSON(http.StatusOK, updatedCatalog)
}

// Katalog sil
func (h *CatalogHandler) DeleteCatalog(c *gin.Context) {
	uploadPath := os.Getenv("UPLOAD_PATH")
	if uploadPath == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload path not configured"})
		return
	}

	id := c.Param("id")
	
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz ID"})
		return
	}

	collection := h.db.Collection("catalogs")
	
	// Önce katalog bilgilerini al (dosya silmek için)
	var catalog models.Catalog
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&catalog)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Katalog bulunamadı"})
		return
	}

	// Veritabanından sil
	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Katalog silinemedi"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Katalog bulunamadı"})
		return
	}

	// PDF dosyasını sil
	if catalog.FileURL != "" {
		pdfPath := filepath.Join(uploadPath, "catalogs-pdf", filepath.Base(catalog.FileURL))
		if err := os.Remove(pdfPath); err != nil {
			println("PDF silme hatası:", err.Error())
		}
	}

	// Görsel varsa sil
	if catalog.ImageURL != "" {
		imagePath := filepath.Join(uploadPath, "catalog-images", filepath.Base(catalog.ImageURL))
		if err := os.Remove(imagePath); err != nil {
			println("Görsel silme hatası:", err.Error())
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Katalog başarıyla silindi"})
}