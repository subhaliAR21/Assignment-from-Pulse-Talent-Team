# Pulse Video Management & Streaming Application

A secure, full-stack multi-tenant application for video uploading, sensitivity analysis, and real-time streaming.

## 🚀 Features
- **Multi-Tenant Architecture**: Complete data isolation using `tenantId`. Users only access content belonging to their organization/domain.
- **RBAC (Role-Based Access Control)**: Three distinct roles (Admin, Editor, Viewer) with specific permissions for uploading and management.
- **Real-Time Processing Pipeline**: Integrated with Socket.io to provide live updates on video sensitivity analysis (Safe/Flagged/Pending).
- **Advanced Streaming**: Utilizes HTTP 206 Partial Content support for efficient, seekable video playback.
- **Integrated Media Player**: Custom-built player that authorizes streams via secure JWT tokens.
- **Modern UI**: Fully responsive, sidebar-based dashboard built with React and Vite.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Axios, Socket.io-client, Lucide-React.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, Multer.
- **Security**: JWT Authentication, Bcrypt password hashing.
- **Processing**: Simulated AI Sensitivity Analysis pipeline.

## 🏗 Architecture & Design Decisions
1. **Multi-Tenancy**: Every user and video is associated with a `tenantId`. The backend API strictly filters data based on the authenticated user's tenant, ensuring no data leakage between organizations.
2. **Streaming Strategy**: Implemented HTTP 206 Range Requests. This allows the browser to request specific byte ranges, enabling users to skip forward in videos instantly.
3. **RBAC Logic**: The UI dynamically adapts based on the user's role. "Viewer" roles cannot see the upload interface, and "Flagged" videos are restricted from playback in the player.
4. **Processing Pipeline**: Video analysis is triggered as an asynchronous task post-upload. Socket.io pushes status changes to the frontend in real-time.

## 📋 Installation & Setup

### Prerequisites
- Node.js (Latest LTS)
- MongoDB (Local or Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key

4. `npm run dev`

### Frontend Setup
1. `cd frontend`

2. `npm install`

3. `npm run dev`

## 🧪 Testing the Application

### Roles & Permissions
- **Admin:** Full access to upload and view all tenant videos.

- **Editor:** Can upload new content and view the library.

- **Viewer:** Read-only access; the "Push New Content" UI is hidden, and API upload access is restricted.

### Multi-Tenancy Test
1. Register **User A** with userA@apple.com. Upload a video.
2. Register **User B** with userB@google.com.
3. Login as **User B.** You will notice that User A's videos are not visible, confirming complete data isolation.

### Video Processing
- Upon upload, videos enter a **PENDING** state.
- After a simulated analysis, they move to **SAFE** (playable) or **FLAGGED** (playback disabled).   