const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  patientName: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  service: {
    type: String,
    enum: ['Consultation', 'Surgery', 'Lab Test', 'Imaging', 'Pharmacy', 'Room Charges', 'Other'],
    required: true
  },
  description: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  refundedAt: Date,
  refundAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
