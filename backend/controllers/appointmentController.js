const Appointment = require('../models/Appointment');
const TimeSlot = require('../models/TimeSlot');

// Helper to get day of the week (e.g., "Monday")
function getWeekdayFromDate(dateString) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateString).getDay()];
}

// Book an appointment (Client)
exports.createAppointment = async (req, res) => {
  try {
    const { timeSlot, petsWithServices, date } = req.body;

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can book appointments' });
    }

    if (!Array.isArray(petsWithServices) || petsWithServices.length === 0) {
      return res.status(400).json({ message: 'At least one pet and service is required.' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Appointment date is required.' });
    }

    const slot = await TimeSlot.findById(timeSlot).populate('vet');
    if (!slot) {
      return res.status(404).json({ message: 'Time slot not found.' });
    }

    // Ensure the date's day matches the slot's day
    const weekday = getWeekdayFromDate(date);
    if (weekday !== slot.day) {
      return res.status(400).json({ message: `Date must fall on a ${slot.day}. You selected ${weekday}.` });
    }

    // ✅ Check if slot is already booked on that date
    const alreadyBooked = await Appointment.findOne({ timeSlot, date });
    if (alreadyBooked) {
      return res.status(400).json({ message: 'This time slot is already booked for that date.' });
    }

    const appointment = new Appointment({
      client: req.user.userId,
      timeSlot,
      date,
      petsWithServices
    });

    await appointment.save();

    res.status(201).json({ message: 'Appointment booked successfully.', appointment });

  } catch (err) {
    console.error('Create Appointment Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Automatically mark past appointments as missed
exports.markMissedAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Only date (yyyy-mm-dd)

    const result = await Appointment.updateMany(
      {
        date: { $lt: today }, // Before today
        status: 'upcoming'
      },
      { $set: { status: 'missed' } }
    );

    res.json({
      message: `${result.modifiedCount} appointment(s) marked as missed.`,
      success: true
    });
  } catch (err) {
    console.error('Error marking missed appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id).populate('timeSlot');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user.role !== 'vet' || appointment.timeSlot.vet.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to complete this appointment' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Appointment marked as completed', appointment });
  } catch (err) {
    console.error('Complete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, client: req.user.userId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Make time slot available again
    await TimeSlot.findByIdAndUpdate(appointment.timeSlot, { isAvailable: true });

    // Delete appointment
    await appointment.deleteOne();

    res.json({ message: 'Appointment cancelled successfully.' });
  } catch (err) {
    console.error('Cancel Appointment Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/// GET appointments (for client or vet), with optional status filtering
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    const validStatuses = ['upcoming', 'missed', 'completed']

    const status = req.query.status;

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }
    
    if (status) {
      query.status = status;
    }

    // Role-based filtering
    if (req.user.role === 'client') {
      query.client = req.user.userId;
    } else if (req.user.role === 'vet') {
      const vetSlots = await TimeSlot.find({ vet: req.user.userId }).select('_id');
      const slotIds = vetSlots.map(slot => slot._id);
      query.timeSlot = { $in: slotIds };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'timeSlot',
        populate: { path: 'vet', select: 'firstName email' }
      })
      .populate('client', 'firstName email')
      .populate('petsWithServices.pet', 'name species breed')
      .populate('petsWithServices.service', 'name description');

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('Get Appointments Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.submitMissedReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason is required.' });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.status !== 'missed') {
      return res.status(400).json({ message: 'Cannot add reason to a non-missed appointment.' });
    }

    await Appointment.updateOne(
      { _id: id },
      { $set: { missedReason: reason } }
    );

    res.json({ message: 'Reason submitted successfully.' });
  } catch (err) {
    console.error('Missed reason error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    if (!review || review.trim() === '') {
      return res.status(400).json({ message: 'Review is required.' });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot add review to an uncompleted appointment.' });
    }

    // Prevent duplicate review
    if (appointment.review && appointment.review.rating) {
      return res.status(400).json({ message: 'This appointment has already been reviewed.' });
    }

    await Appointment.updateOne(
      { _id: id },
      {
        $set: {
          review: {
            rating,
            text: review
          }
        }
      }
    );


    res.json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update appointment status (Vet only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'vet') {
      return res.status(403).json({ message: 'Only vets can update appointments.' });
    }

    const appointment = await Appointment.findById(id).populate('timeSlot');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (appointment.timeSlot.vet.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this appointment.' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment status updated.', appointment });
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
