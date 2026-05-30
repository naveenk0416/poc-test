const mongoose = require('mongoose');

const FirSchema = new mongoose.Schema({
  firNumber: {
    type: String,
    unique: true
  },
  firDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  policeStation: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  complainant: {
    fullName: String,
    fatherOrHusbandName: String,
    gender: String,
    age: Number,
    mobileNumber: String,
    email: String,
    occupation: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
  },
  victim: {
    sameAsComplainant: Boolean,
    victimName: String,
    gender: String,
    age: Number,
    mobileNumber: String,
    address: String
  },
  incident: {
    incidentType: String,
    occurrenceDate: Date,
    occurrenceTime: String,
    placeOfOccurrence: String,
    district: String,
    state: String,
    incidentDescription: String,
    delayReason: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Registered', 'Assigned', 'Investigation In Progress', 'Evidence Collected', 'Charge Sheet Filed', 'Court Trial', 'Closed', 'Rejected'],
    default: 'Submitted'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Pre-save hook to generate FIR number automatically
// Use an async hook without `next()` (Mongoose handles async hooks by returning a promise)
FirSchema.pre('save', async function() {
  if (!this.firNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const count = await this.constructor.countDocuments();
    this.firNumber = `FIR-${year}-${(count + 1).toString().padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Fir', FirSchema);
