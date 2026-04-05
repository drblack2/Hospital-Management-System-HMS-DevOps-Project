import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Auth API calls
export const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

// Patient API calls
export const getAllPatients = () => {
  return axios.get(`${API_URL}/patients`, getAuthHeader());
};

export const getPatientById = (id) => {
  return axios.get(`${API_URL}/patients/${id}`, getAuthHeader());
};

export const createPatient = (patientData) => {
  return axios.post(`${API_URL}/patients`, patientData, getAuthHeader());
};

export const updatePatient = (id, patientData) => {
  return axios.put(`${API_URL}/patients/${id}`, patientData, getAuthHeader());
};

export const deletePatient = (id) => {
  return axios.delete(`${API_URL}/patients/${id}`, getAuthHeader());
};

// Payment API calls
export const createOrder = (paymentData) => {
  return axios.post(`${API_URL}/payments/create-order`, paymentData, getAuthHeader());
};

export const verifyPayment = (paymentData) => {
  return axios.post(`${API_URL}/payments/verify-payment`, paymentData, getAuthHeader());
};

export const getPaymentHistory = () => {
  return axios.get(`${API_URL}/payments/history`, getAuthHeader());
};

export const getPaymentById = (id) => {
  return axios.get(`${API_URL}/payments/${id}`, getAuthHeader());
};

export const getRazorpayKey = () => {
  return axios.get(`${API_URL}/payments/config/key`);
};

export const refundPayment = (id, refundAmount) => {
  return axios.post(`${API_URL}/payments/refund/${id}`, { refundAmount }, getAuthHeader());
};
