package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// MongoDB bağlantısı
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27018")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Şifreyi hashle
	password := "admin123" // Bu şifreyi not alın
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	// Admin kullanıcısını oluştur
	collection := client.Database("emiroglu").Collection("admins")
	
	// Önce varsa sil
	collection.DeleteMany(ctx, bson.M{"username": "admin"})

	// Yeni admin ekle
	_, err = collection.InsertOne(ctx, bson.M{
		"username": "admin",
		"password": string(hashedPassword),
		"role":     "admin",
	})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Admin kullanıcısı başarıyla oluşturuldu")
	log.Println("Kullanıcı adı: admin")
	log.Println("Şifre: admin123")
}