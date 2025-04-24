# Task-Management-Application
 an application to manage tasks effectively.
 # 📝 Task Management App

This is a full-stack task management application built with **React** (frontend), **Express.js** (backend), and **MongoDB Atlas** (cloud database), all containerized using **Docker** and orchestrated with **Docker Compose**.

> ✅ Everything is pre-configured: no need to set up any database manually.  
> All you need is [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

---

## ✨ Features

- Create, update, and delete task lists  
- Add tasks with title, description, and due date  
- Change task status: To Do, In Work, Done  
- Edit and delete individual tasks  
- Organize tasks by list  
- Clean, responsive, and mobile-friendly UI

---

## 🛠 Tech Stack

- **Frontend:** React, CSS  
- **Backend:** Express.js, Mongoose  
- **Database:** MongoDB Atlas (hosted by the author)  
- **DevOps:** Docker, Docker Compose  

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

> This will automatically start both the backend (Node.js + MongoDB connection) and frontend (React + Nginx) using Docker.

- Client: [http://localhost:3000](http://localhost:3000)  
- Server: [http://localhost:4000](http://localhost:4000)

---

## 📁 Folder Structure

```
TaskManagement/
│
├── client/         # React frontend (with Dockerfile)
├── server/         # Express backend (with Dockerfile + .env)
└── docker-compose.yml
```

---

## 🔐 Environment Variables

The application already uses a private MongoDB Atlas connection, defined securely in a `.env` file that is **not** shared in this repository.

> You do **not** need to create your own `.env` or MongoDB account.  
> The application is ready-to-run as-is.

---

## 🧠 Author

Developed with ❤️ by **Shaked Crissy**  
Feel free to connect 

---

## 📄 License

This project is provided for demonstration and learning purposes only.

