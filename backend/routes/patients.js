const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// Get all patients
router.get('/', auth, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ admissionDate: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new patient
router.post('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, medicalHistory, allergies, currentMedications, emergencyContact } = req.body;

    const patient = new Patient({
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
      emergencyContact
    });

    await patient.save();
    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update patient
router.put('/:id', auth, async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);
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

    await patient.save();
    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete patient
router.delete('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
