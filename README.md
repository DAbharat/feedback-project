# 💬 Feedback Management Platform

A full-stack feedback collection system built using **React (Vite)**, **Express.js**, and **MongoDB**.  
Designed for **students, teachers, and admins**, it supports user authentication, profile uploads, form-based feedback, notifications, and role-based workflows — making it ideal for our institution to manage structured feedback efficiently.

---

## 🚀 Features Implemented

- 👥 **Role-based Access** — Student, Teacher, and Admin roles with protected routes  
- 🔐 **JWT Authentication** — Secure login & registration  
- 🗂️ **Dynamic Feedback Forms** — Create, submit, and view feedback and responses  
- 🧾 **General Feedback** — Simple feedback submission and admin response  
- 🖼️ **Profile Uploads** — File uploads via Multer  
- 🔔 **Notification System** — Real-time updates for feedback and admin actions  
- 🧰 **Admin Dashboard** — Manage users, forms, feedbacks, and notifications  
- 🌐 **CORS & Helmet** — Secure API setup for production  
- ⚙️ **Vite + Proxy Setup** — Smooth frontend-backend integration
- 🪪 **Automatic Role Detection via OCR** — User roles (Teacher/Student) are auto-assigned by scanning ID cards using OCR, ensuring authenticity and preventing fake role creation.


---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js (Vite), Context API, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Storage** | Multer, Cloudinary integration |
| **Utilities** | Morgan, Helmet, CORS, Rate Limiter |
| **Version Control** | Git & GitHub |

---

## ⚙️ Setup Instructions

### 🖥️ Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DAbharat/feedback-project.git
   cd feedback-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
4. Create a .env file in the root directory and add:
   ```bash
   MONGODB_URI=your-mongodb-uri
   PORT=5000
   JWT_SECRET=your-jwt-secret
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```
   
5. Run the server:
   ```bash
   npm run start
   ```

---

### 🖥️ Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```

2. Create a .env file:
   ```bash
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```bash
   http://localhost:5173
   ```
---

## 🧠 What's Working
- ✅ **User registration & login with JWT**
- ✅ **Role-based dashboards for admin, teacher, and student**
- ✅ **Feedback submission & admin review system**
- ✅ **Notification delivery & UI integration**
- ✅ **Profile uploads (with Multer & Cloudinary)**
- ✅ **Form creation & analytics for responses**
- ✅ **Automatic role assignment through OCR-based ID verification**

---

## 🧩 What's Left to Improve
- 📊 **Add analytics dashboard for form results**
- 🔁 **Enable live updates with WebSockets**
- 📱 **Enhance mobile responsiveness**
- 🧪 **Add automated testing (Jest / Supertest)**
- 💾 **Implement data backup & recovery script**
- 📢 **Add email or push notification support**

---

## 📂 Folder Structure (Simplified)
```bash
feedback-project/
├── src/
│   ├── controllers/       # Business logic for routes
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Auth & role-based middlewares
│   ├── utils/             # Helpers (ApiError, Cloudinary, etc.)
│   └── app.js / index.js  # App entry & setup
└── frontend/
    ├── src/
    │   ├── pages/         # Main pages (Auth, Feedback, Admin)
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth & Notification context
    │   └── services/      # API integration
```

---

## 🧾 API Overview

**Base URL:** `/api/v1`

| Endpoint | Description |
|-----------|--------------|
| `/users` | Register, login, upload profile |
| `/feedbacks` | Submit, view, mark-read |
| `/forms` | Create, update, fetch forms |
| `/form-responses` | Submit and get analytics |
| `/notifications` | Send and fetch alerts |

---

## 👨‍💻 Author
- [@DAbharat](https://github.com/DAbharat)



   
