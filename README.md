# 🛍️ Product Management App

A full-stack **Product Management** application built with:

- 🟨 **Node.js (Express)** backend
- 🟦 **Go (Gin)** backend
- ⚛️ **Next.js** frontend

---

## 📦 Tech Stack

| Component  | Technology        |
| ---------- | ----------------- |
| Frontend   | Next.js           |
| Backend #1 | Node.js + Express |
| Backend #2 | Go + Gin          |

---

## 🚀 Local Deployment

### 🔧 Prerequisites

Ensure the following are installed on your machine:

- **Node.js** `v20.x`
- **Go** `v1.23.9`

---

### 🟨 1. Run the Node.js Backend

```bash
cd be-node
npm install
node index.js
```

Runs on: `http://localhost:3001`

To run tests:

```bash
npx vitest
```

---

### 🟦 2. Run the Go Backend

```bash
cd be-go
go mod tidy
go run main.go
```

Runs on: `http://localhost:3002`

To run tests:

```bash
go test ./handlers/
```

---

### ⚛️ 3. Run the Frontend (Next.js)

```bash
cd fe-next
```

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL_NODE=http://localhost:3001
NEXT_PUBLIC_API_URL_GO=http://localhost:3002
```

Then install dependencies and start:

```bash
npm install
npm run dev
```

Frontend available at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Production Deployment

_Deployed on a VPS (via IdCloudHost):_

- **Frontend (Next.js)**: [http://103.171.85.36:3000](http://103.171.85.36:3000)
- **Node.js Backend**: [http://103.171.85.36:3001](http://103.171.85.36:3001)
- **Go Backend**: [http://103.171.85.36:3002](http://103.171.85.36:3002)

---

## ✅ Final Notes

- Start **both backends** before running the frontend.
- Switch between Node.js and Go APIs by updating `.env.local`.
- For production VPS usage, keep backend services running with **PM2** (Node.js) and **systemd** or background jobs (Go).

---

## 💡 Discount Calculator (logic-go)

This directory contains the discount calculator service (second part of the test).

Run it locally:

```bash
cd logic-go
go mod tidy
go run main.go
```

To run tests:

```bash
go test ./handlers/
```

---

## 📋 Postman Collection

Import the Postman collection file `go-next-express.postman_collection.json` for API documentation and testing.

- Modify environment variables in Postman to point to your local or deployed hosts/ports as needed.

---

> Developed by @Shercosta
