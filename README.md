# 🛍️ Product Management App

This repository contains a full-stack **Product Management** application built with:

- 🟨 A **Node.js (Express)** backend
- 🟦 A **Go (Gin)** backend
- ⚛️ A **Next.js** frontend

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

Make sure the following are installed on your machine:

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

---

### 🟦 2. Run the Go Backend

```bash
cd be-go
go mod tidy
go run main.go
```

Runs on: `http://localhost:3002`

---

### ⚛️ 3. Run the Frontend (Next.js)

```bash
cd fe-next
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL_NODE=http://localhost:3001
NEXT_PUBLIC_API_URL_GO=http://localhost:3002
```

Then:

```bash
npm install
npm run dev
```

Frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Production Deployment

> The app has been deployed to a VPS (via IdCloudHost):

- **Frontend (Next.js)**: [http://103.171.85.36:3000](http://103.171.85.36:3000)
- **Node.js Backend**: [http://103.171.85.36:3001](http://103.171.85.36:3001)
- **Go Backend**: [http://103.171.85.36:3002](http://103.171.85.36:3002)

---

## ✅ Final Notes

- Make sure both backends are running before starting the frontend.
- You can switch between Node.js and Go APIs by updating `.env.local` accordingly.
- To keep backend services running on the VPS, consider using **PM2** (for Node) and background execution or systemd (for Go).

---

logic-go
logic-go is a directory for the second part of the test (discount calculator)

you can run this by going to the folder logic-go, run go mod tidy, and run go run main.go

---

postman collection:

you can see the postman collection for API Documentation from the postman json collection file

@Shercosta
