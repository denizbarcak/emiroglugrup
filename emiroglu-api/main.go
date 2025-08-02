package main

import (
	"context"
	"log"
	"os"
	"time"

	"emiroglu-api/config"
	"emiroglu-api/handlers"
	"emiroglu-api/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func main() {
	// .env dosyasını yükle
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Environment variable'ları kontrol et
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI environment variable is not set")
	}

	// MongoDB bağlantısı
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// MongoDB URI'yi logla
	log.Printf("Connecting to MongoDB with URI: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Bağlantıyı test et
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB connection test failed:", err)
	}
	log.Println("Successfully connected to MongoDB!")

	// Gin router'ı başlat
	r := gin.Default()

	// CORS ayarları
	r.Use(config.CorsMiddleware())

	// Assets klasörlerini oluştur
	if err := os.MkdirAll("../assets/catalogs-pdf", 0755); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll("../assets/catalog-images", 0755); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll("../assets/site", 0755); err != nil {
		log.Fatal(err)
	}

	// Statik dosya sunucusu
	r.Static("/assets", "../assets")

	// Database instance'ını oluştur
	db := client.Database("emiroglu")

	// Handlers
	catalogHandler := handlers.NewCatalogHandler(db)
	contactHandler := handlers.NewContactHandler(db)

	// Route'ları tanımla
	setupRoutes(r, catalogHandler, contactHandler)

	// Sunucuyu başlat
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func setupRoutes(r *gin.Engine, catalogHandler *handlers.CatalogHandler, contactHandler *handlers.ContactHandler) {
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", handleLogin)
		}

		catalogs := api.Group("/catalogs")
		{
			catalogs.GET("", catalogHandler.GetCatalogs)
			catalogs.GET("/:id", catalogHandler.GetCatalog)
			catalogs.POST("", middleware.AuthMiddleware(), catalogHandler.CreateCatalog)
			catalogs.PUT("/:id", middleware.AuthMiddleware(), catalogHandler.UpdateCatalog)
			catalogs.DELETE("/:id", middleware.AuthMiddleware(), catalogHandler.DeleteCatalog)
		}

		contact := api.Group("/contact-info")
		{
			contact.GET("", contactHandler.GetContactInfo)
			contact.PUT("", middleware.AuthMiddleware(), contactHandler.UpdateContactInfo)
		}
	}
}