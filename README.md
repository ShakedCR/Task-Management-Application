# 📝 Task Management Application

This is a full-stack task management app built with:

- ✅ **React** (frontend)  
- ✅ **Express.js** (backend)  
- ✅ **MongoDB Atlas** (cloud database)  
- ✅ **Docker & Docker Compose** (for seamless deployment)

> ✅ Everything is pre-configured:  
> You **do not need to set up any `.env` file or database manually**.  
> All you need is [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

---

## ✨ Features

- Create, update, and delete task lists  
- Add tasks with title, description, and due date  
- Change task status: `To Do`, `In Work`, `Done`  
- Cannot delete tasks marked as `Done`  
- Clean, responsive, and mobile-friendly UI

---

## 🛠 Tech Stack

| Frontend  | Backend    | Database       | Deployment     |
|-----------|------------|----------------|----------------|
| React     | Express.js | MongoDB Atlas  | Docker Compose |

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

This will automatically start both the backend and frontend containers.

- Client: [http://localhost:3000](http://localhost:3000)  
- Server API: [http://localhost:4000](http://localhost:4000)

---

## 📁 Folder Structure

```
TaskManagement/
│
├── client/         # React frontend (with Dockerfile)
├── server/         # Express backend (with Dockerfile)
└── docker-compose.yml
```

---

## 🔐 Environment & Security

> **No `.env` file required.**  
> The MongoDB connection string is securely provided to the backend using Docker environment variables (defined in `docker-compose.yml`).

You **do not need** to create a MongoDB account or set anything up manually.

---

## 👩‍💻 Author

Built with ❤️ by [Shaked Crissy](https://github.com/ShakedCR)  
Feel free to explore, learn, and reuse this structure in your own full-stack projects!

---

## 📄 License

This project is provided for demonstration and educational purposes only.

---

## 📄 License

This project is provided for demonstration and learning purposes only.

