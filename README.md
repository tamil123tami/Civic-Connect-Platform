# Civic Connect Platform

A modern, full-stack web application designed to bridge the gap between citizens and local administration. It allows citizens to report civic issues (like potholes, garbage, streetlights) and administrators to manage and resolve them efficiently in real-time.

## 🏗️ System Architecture & How It Works

The platform functions as a distributed system with three main components:

1.  **Client (Frontend)**:
    -   Built with **React** and **Vite** for a fast, responsive UI.
    -   Uses **Socket.io-client** to listen for real-time updates (e.g., "Complaint Resolved").
    -   Communicates with the Backend via REST API for form submissions and data retrieval.

2.  **Server (Backend)**:
    -   Built with **Node.js** and **Express**.
    -   Acts as the central coordinator. It stores data in **MongoDB** and handles image uploads (configured for AWS S3).
    -   Uses **Socket.io** to broadcast events to connected clients.
    -   When a complaint is submitted, it forwards the description to the **AI Service** to get a category prediction.

3.  **AI Service (Microservice)**:
    -   Built with **Python** and **FastAPI**.
    -   Uses **Scikit-learn** to train a Machine Learning model (TF-IDF + SGD Classifier) on complaint text.
    -   Exposes a prediction API (`/predict`) that the Backend calls to automatically categorize issues (e.g., "dark street" -> `LIGHT`).

## 📦 Dependencies

### 1. Client (Frontend)
*   `react`, `react-dom`: UI Library.
*   `vite`: Build tool and dev server.
*   `tailwindcss`: Utility-first CSS framework.
*   `framer-motion`: For smooth animations and page transitions.
*   `socket.io-client`: For real-time WebSocket communication.
*   `react-leaflet`, `leaflet`: Interactive maps.
*   `react-hot-toast`: Beautiful popup notifications.
*   `axios`: HTTP client for API requests.
*   `lucide-react`: Icon library.

### 2. Server (Backend)
*   `express`: Web server framework.
*   `mongoose`: MongoDB object modeling.
*   `socket.io`: Real-time event engine.
*   `cors`: Cross-Origin Resource Sharing.
*   `dotenv`: Environment variable management.
*   `multer`: Middleware for handling `multipart/form-data` (file uploads).
*   `aws-sdk`: For interacting with AWS services (S3).

### 3. AI Service
*   `fastapi`: Modern, high-performance web framework for APIs.
*   `uvicorn`: ASGI server implementation.
*   `scikit-learn`: Machine Learning library.
*   `numpy`: Fundamental package for scientific computing.

## 🛠️ Installation & Setup

### Prerequisites
-   **Node.js** (v16 or higher)
-   **Python** (v3.9 or higher)
-   **MongoDB** (Local instance running on port 27017)

### Step 1: Backend Setup
```bash
cd server
npm install
# Ensure your local MongoDB is running
npm start
# Server runs on http://localhost:5000
```
*Note: Make sure `.env` points to your local DB: `MONGO_URI=mongodb://127.0.0.1:27017/civic-platform`*

### Step 2: AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
# Start the service
uvicorn app:app --reload
# Service runs on http://127.0.0.1:8000
```

### Step 3: Frontend Setup
```bash
cd client
npm install
npm run dev
# App opens at http://localhost:5173
```

## 🧪 How to Use

1.  **Login**:
    -   **Citizen**: `citizen` / `citizen123`
    -   **Admin**: `admin` / `admin123`
2.  **Submit a Complaint** (Citizen):
    -   Click "Report Issue".
    -   Type a description (e.g., "Huge pothole on Main St").
    -   Upload a photo (on mobile, this opens the camera).
    -   Click Submit. The AI will auto-categorize it as `POTHOLE`.
3.  **Resolve** (Admin):
    -   Go to Dashboard.
    -   Click "Resolve" on the complaint.
    -   The Citizen will immediately see a popup notification!

## 🔧 Troubleshooting
-   **"Network Error"**: Ensure the Server is running (`npm start` in `server/`).
-   **Image Upload Issues**: Ensure the backend `uploads` directory exists or S3 credentials are correct.
-   **Map Not Loading**: Check your internet connection (Leaflet tiles require internet).
