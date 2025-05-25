package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

func initTestDB() *sql.DB {
	db, _ := sql.Open("sqlite", ":memory:")
	db.Exec(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL
    )`)
	return db
}

func registerRoutes(r *gin.Engine) {
	r.POST("/products", func(c *gin.Context) {
		var p Product
		if err := c.BindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if p.Name == "" || p.Description == "" || p.Price <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "name, description, and price are required"})
			return
		}
		res, err := db.Exec(`INSERT INTO products (name, description, price) VALUES (?, ?, ?)`, p.Name, p.Description, p.Price)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		id, _ := res.LastInsertId()
		p.ID = int(id)
		c.JSON(http.StatusCreated, p)
	})

	r.GET("/products", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, name, description, price FROM products")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		products := []Product{}
		for rows.Next() {
			var p Product
			rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price)
			products = append(products, p)
		}
		c.JSON(http.StatusOK, products)
	})
}

func setupTestRouter() *gin.Engine {
	db = initTestDB() // Create a temp in-memory DB
	r := gin.Default()
	registerRoutes(r)
	return r
}

func TestCreateProductGo(t *testing.T) {
	r := setupTestRouter()

	body := map[string]interface{}{
		"name":        "Go Shirt",
		"description": "Cool go merch",
		"price":       25.0,
	}
	jsonValue, _ := json.Marshal(body)

	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Fatalf("expected status 201, got %d", resp.Code)
	}
}

func TestRejectInvalidProductGo(t *testing.T) {
	r := setupTestRouter()

	body := map[string]interface{}{
		"name":        "Invalid",
		"description": "No price",
		"price":       0,
	}
	jsonValue, _ := json.Marshal(body)

	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.Code)
	}
}

func TestGetProductsGo(t *testing.T) {
	r := setupTestRouter()

	// Insert a product
	body := map[string]interface{}{
		"name":        "Product A",
		"description": "desc",
		"price":       10.0,
	}
	jsonValue, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, req)

	// Retrieve products
	getReq := httptest.NewRequest(http.MethodGet, "/products", nil)
	getResp := httptest.NewRecorder()
	r.ServeHTTP(getResp, getReq)

	data, _ := io.ReadAll(getResp.Body)
	var products []Product
	json.Unmarshal(data, &products)

	if len(products) == 0 {
		t.Fatalf("expected products, got none")
	}
}
