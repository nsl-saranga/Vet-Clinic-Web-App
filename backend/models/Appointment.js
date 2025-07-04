const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
  date: { type: Date, required: true },
  petsWithServices: [
    {
      pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }
    }
  ],
  status: {
    type: String,
    enum: ['completed', 'upcoming', 'missed'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
