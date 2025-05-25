package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func main() {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec(`
		CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL
        )
	`)
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.Use(cors.Default())

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
			if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			products = append(products, p)
		}

		c.JSON(http.StatusOK, products)
	})

	r.POST("/products", func(c *gin.Context) {
		var p Product
		if err := c.BindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if p.Name == "" || p.Description == "" || p.Price == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "name, description, and price are required"})
			return
		}

		if p.Price <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "price must be greater than 0"})
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

	r.GET("/reset", func(ctx *gin.Context) {
		db.Exec("DELETE FROM products")
		ctx.JSON(http.StatusOK, gin.H{"message": "products deleted"})
	})

	r.Run(":3002")
}
