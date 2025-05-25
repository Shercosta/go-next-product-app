const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");

const app = express();
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database(":memory:")

db.run(`
    CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL
        )`)

app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(rows)
    })
})

app.post("/products", (req, res) => {
    const { name, description, price } = req.body

    if (!name || !description || !price) {
        return res.status(400).json({ error: "name, description, and price are required" })
    }

    if (price <= 0) {
        return res.status(400).json({ error: "price must be greater than 0" })
    }

    const stmt = db.prepare("INSERT INTO products (name, description, price) VALUES (?, ?, ?)")
    stmt.run(name, description, price, function (err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ id: this.lastID, name, description, price });
    })
    stmt.finalize()
})

app.get("/reset", (req, res) => {
    db.run("DELETE FROM products", [], (err) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ message: "products deleted" })
    })
})

const PORT = process.env.PORT || 3001;
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`be node listening on port ${PORT}`);
    });
}

module.exports = app;
