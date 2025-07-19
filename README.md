# 🧠 Live Poll Frontend

This is the **frontend client** for the [Live Poll Microservice Platform](https://github.com/Pixelz123/live_poll_microservice), built with **Next.js** and **Tailwind CSS**, offering a modern, responsive interface for users to participate in real-time quizzes and polls.

---

## 📌 Backend Repository

➡️ [Live Poll Backend Microservice Repo](https://github.com/Pixelz123/live_poll_microservice)

---

## 📜 Table of Contents

- [🚀 Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📦 Setup Instructions](#-setup-instructions)
- [🔌 WebSocket Integration](#-websocket-integration)
- [📁 Project Structure](#-project-structure)
- [📚 Future Improvements](#-future-improvements)

---

## 🚀 Features

- 🌐 Built with **Next.js** for SSR and performance
- 💬 Real-time interaction using **WebSockets** (via backend)
- 👥 Join and participate in live polls and quizzes
- 🧩 Dynamically rendered question & option interface
- ⏱️ Countdown timer per question
- 📊 Live leaderboard view
- 🧑‍💻 JWT-based authentication
- 🎨 Styled using **Tailwind CSS**

---

## ⚙️ Tech Stack

- **Next.js** (React Framework)
- **Tailwind CSS** (UI styling)
- **Axios** (HTTP client)
- **Socket.io-client** (WebSocket communication)
- **JWT Auth Integration** (via backend)
- **Redux / Context API** *(if applicable)*

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Pixelz123/live_poll_frontend_msrv.git
cd live_poll_frontend_msrv
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

Adjust the base URLs to point to your backend API Gateway.

### 4. Run the Development Server

```bash
npm run dev
```

Then visit: `http://localhost:3000`

---

## 🔌 WebSocket Integration

- Connects to backend via `socket.io-client`
- Listens to real-time events:
  - `start`
  - `question`
  - `timesup`
  - `leaderboard_Data`
- Emits:
  - `connect&wait`
  - `user_response`

All events are coordinated with the backend protocol.

---

## 📁 Project Structure

```txt
/pages          → Route-based components (Next.js)
/components     → Reusable UI components
/styles         → Tailwind CSS config
/utils          → Axios, WebSocket utils, token management
```

---

## 📚 Future Improvements

- Dark mode support
- Admin dashboard for poll creation
- Mobile UX polish
- Toast alerts and animations
- Progressive Web App (PWA) support

