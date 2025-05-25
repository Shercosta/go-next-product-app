# 🛍️ Product Management App

This repository contains a full-stack **Product Management** application with:

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

Make sure you have the following installed:

- **Node.js** version `20.x`
- **Go** version `1.23.9`

---

### 🟨 1. Run the Node.js Backend

```bash
cd be-node
npm install
node index.js
```

By default, it runs on: `http://localhost:3001`

---

### 🟦 2. Run the Go Backend

```bash
cd be-go
go mod tidy
go run main.go
```

By default, it runs on: `http://localhost:3002`

---

### ⚛️ 3. Run the Frontend (Next.js)

```bash
cd fe-next
```

Create a file named `.env.local` and add the following content:

```env
NEXT_PUBLIC_API_URL_NODE=http://localhost:3001
NEXT_PUBLIC_API_URL_GO=http://localhost:3002
```

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Final Notes

- Ensure both backends are running before launching the frontend.
- You can switch between Go and Node API in the frontend by modifying the `.env.local`.

@Shercosta
