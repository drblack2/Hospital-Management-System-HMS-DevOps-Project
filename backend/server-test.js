const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// In-memory database for testing
const users = [];
const patients = [];

let userIdCounter = 1;
let patientIdCounter = 1;

// Simple in-memory auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authorization token, access denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = {
      id: userIdCounter++,
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'staff'
    };

    users.push(user);

    // Create JWT token
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Patient Routes
app.get('/api/patients', auth, (req, res) => {
  res.json(patients);
});

app.get('/api/patients/:id', auth, (req, res) => {
  const patient = patients.find(p => p._id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

app.post('/api/patients', auth, (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, medicalHistory, allergies, currentMedications, emergencyContact } = req.body;

    const patient = {
      _id: `patient_${patientIdCounter++}`,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      allergies,
      currentMedications,
      emergencyContact,
      status: 'Active',
      admissionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    patients.push(patient);
    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

app.put('/api/patients/:id', auth, (req, res) => {
  try {
    const patient = patients.find(p => p._id === req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { firstName, lastName, phone, dateOfBirth, gender, address, medicalHistory, allergies, currentMedications, emergencyContact, status } = req.body;

    if (firstName) patient.firstName = firstName;
    if (lastName) patient.lastName = lastName;
    if (phone) patient.phone = phone;
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender) patient.gender = gender;
    if (address) patient.address = address;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (allergies) patient.allergies = allergies;
    if (currentMedications) patient.currentMedications = currentMedications;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (status) patient.status = status;

    patient.updatedAt = new Date();

    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

app.delete('/api/patients/:id', auth, (req, res) => {
  try {
    const index = patients.findIndex(p => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patients.splice(index, 1);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System - Backend API (Test Mode)' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (In-Memory Database Mode)`);
});
