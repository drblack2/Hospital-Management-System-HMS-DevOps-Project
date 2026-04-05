# Hospital Management System - Development Instructions

Full-stack Node.js application for hospital patient management with React frontend and Express backend.

## Project Structure
- `frontend/` - React.js application for UI
- `backend/` - Express.js API server
- `frontend/src/` - React components and pages
- `backend/routes/` - API endpoint definitions
- `backend/models/` - Database schemas

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## Environment Variables
Create `.env` file in backend folder with:
```
MONGO_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your_secret_key_here
PORT=5000
```

## Technologies Used
- Frontend: React.js, Axios, React Router
- Backend: Express.js, Mongoose, JWT, Bcrypt
- Database: MongoDB
- Node.js v14+

## Features
- Patient registration and management
- Patient details viewing and editing
- Secure login authentication
- RESTful API
- Responsive UI
