# Hospital Management System

A full-stack Node.js application for managing hospital patient records with a modern React frontend and Express.js backend.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Patient Management**: Add, view, edit, and delete patient records
- **Medical History Tracking**: Store patient medical history, allergies, and medications
- **Emergency Contacts**: Maintain emergency contact information for patients
- **Role-Based Access**: Support for different user roles (Admin, Doctor, Nurse, Staff)
- **Responsive UI**: Clean and intuitive user interface
- **RESTful API**: Complete REST API for all operations

## Technology Stack

### Frontend
- React.js 18.2.0
- React Router DOM 6.11.2
- Axios for HTTP requests
- CSS3 for styling

### Backend
- Express.js 4.18.2
- Node.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Database
- MongoDB

## Project Structure

```
hospital-management/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PatientList.js
│   │   │   ├── PatientDetail.js
│   │   │   └── AddPatient.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── api.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Patient.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── patients.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection string)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string and JWT secret:
```
MONGO_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Create a new account or login with existing credentials
3. Browse and manage patient records
4. Add new patients to the system
5. View and edit patient details

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Patients
- `GET /api/patients` - Get all patients (requires auth)
- `GET /api/patients/:id` - Get patient by ID (requires auth)
- `POST /api/patients` - Create new patient (requires auth)
- `PUT /api/patients/:id` - Update patient (requires auth)
- `DELETE /api/patients/:id` - Delete patient (requires auth)

## Authentication

All patient-related endpoints require a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Running Both Services

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Both services will be running and automatically connected.

## Development

### Backend Development
For automatic server restart during development:
```bash
cd backend
npm run dev
```

### Frontend Development
The React development server automatically reloads changes.

## Features Explained

### Patient Registration
- Register patients with comprehensive medical information
- Store emergency contact details
- Track medical history and allergies

### Patient Management
- View all patients in a searchable list
- Click on any patient to view full details
- Edit patient information
- Delete patient records (with confirmation)

### Authentication
- Secure user registration and login
- JWT-based authentication
- Different user roles (Admin, Doctor, Nurse, Staff)

### Dashboard
- Quick navigation to main features
- User welcome message
- Links to patient management

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API endpoints
- Secure token storage in local storage
- CORS enabled for frontend-backend communication

## Error Handling

The application includes comprehensive error handling:
- Validation error messages
- Network error notifications
- User-friendly alert messages
- Detailed server error logs

## Future Enhancements

- Appointment scheduling
- Medication reminders
- Medical test results tracking
- Doctor-patient messaging
- Email notifications
- Advanced search and filtering
- Data export (PDF/Excel)
- Multi-language support

## License

MIT License

## Support

For support and questions, please refer to the documentation or contact the development team.
