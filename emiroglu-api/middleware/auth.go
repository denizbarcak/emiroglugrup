package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const jwtSecret = "your-secret-key" // Production ortamında environment variable kullanılmalı

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}
		println("Auth Header:", authHeader) // Header'ı kontrol edelim

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		println("Token String:", tokenString) // Token'ı kontrol edelim
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Role kontrolü
		role, ok := claims["role"].(string)
		if !ok || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin yetkisi gerekli"})
			c.Abort()
			return
		}

		c.Next()
	}
}