# 📝 Task Management Application

This is a full-stack task management app built with:

- ✅ **React** (frontend)  
- ✅ **Express.js** (backend)  
- ✅ **MongoDB** (local database via Docker)  
- ✅ **Docker & Docker Compose** (for seamless local deployment)

> ✅ Everything is pre-configured:  
> You **do not need to manually set up any database or `.env` file**.  
> All you need is [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

---

## ✨ Features

- Create, update, and delete task lists  
- Add tasks with title, description, and due date  
- Change task status: `To Do`, `In Work`, `Done`  
- Cannot delete tasks marked as `Done`  
- Clean, responsive, and mobile-friendly UI

---

## 🛠 Tech Stack

| Frontend  | Backend    | Database                 | Deployment     |
|-----------|------------|---------------------------|----------------|
| React     | Express.js | MongoDB (Docker container) | Docker Compose |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShakedCR/Task-Management-Application.git
cd Task-Management-Application
```

### 2. Run the App with Docker Compose

```bash
docker-compose up --build
```

This will automatically start the **MongoDB**, **backend**, and **frontend** containers.

- Client: [http://localhost:3000](http://localhost:3000)  
- Server API: [http://localhost:4000](http://localhost:4000)

---

## 📁 Folder Structure

```
TaskManagement/
│
├── client/         # React frontend (with Dockerfile)
├── server/         # Express backend (with Dockerfile and .env)
├── docker-compose.yml
└── README.md
```

---

## 🔐 Environment & Security

> **No manual `.env` setup required.**  
> The MongoDB connection URI is injected automatically via Docker environment variables (defined in `docker-compose.yml`).

You **do not need** to create a MongoDB Atlas account or configure any external database —  
everything runs locally inside Docker containers.

---

## 👩‍💻 Author

Built with ❤️ by [Shaked Crissy](https://github.com/ShakedCR)  
Feel free to explore, learn, and connect with me! (:

---

## 📄 License

This project is provided for demonstration and educational purposes only.

---
