const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  vet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: String,
    enum: [
      'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday', 'Sunday'
    ],
    required: true
  },
  startTime: {
    type: String, // Use 'HH:mm' format (e.g., '09:00')
    required: true
  },
  endTime: {
    type: String, // Use 'HH:mm' format (e.g., '17:00')
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
