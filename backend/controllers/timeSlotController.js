const TimeSlot = require('../models/TimeSlot');

// ⏰ Check if time slots overlap
const isOverlapping = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

// ➕ Add new time slot
exports.addTimeSlot = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;
    const vetId = req.user.userId;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ error: 'Day, start time, and end time are required.' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Start time must be before end time.' });
    }

    // Check for overlap
    const existingSlots = await TimeSlot.find({ vet: vetId, day });
    for (let slot of existingSlots) {
      if (isOverlapping(startTime, endTime, slot.startTime, slot.endTime)) {
        return res.status(409).json({ error: 'This time slot overlaps with an existing one.' });
      }
    }

    const newSlot = await TimeSlot.create({ vet: vetId, day, startTime, endTime });
    res.status(201).json({ message: 'Time slot added successfully', slot: newSlot });

  } catch (error) {
    console.error('Add Time Slot Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✏️ Edit a time slot
exports.updateTimeSlot = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;
    const vetId = req.user.userId;
    const slotId = req.params.id;

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Start time must be before end time.' });
    }

    // Check for overlap (exclude the current slot)
    const existingSlots = await TimeSlot.find({ vet: vetId, day, _id: { $ne: slotId } });
    for (let slot of existingSlots) {
      if (isOverlapping(startTime, endTime, slot.startTime, slot.endTime)) {
        return res.status(409).json({ error: 'This time slot overlaps with an existing one.' });
      }
    }

    const updated = await TimeSlot.findOneAndUpdate(
      { _id: slotId, vet: vetId },
      { day, startTime, endTime },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    res.json({ message: 'Time slot updated successfully', slot: updated });

  } catch (error) {
    console.error('Update Time Slot Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📋 Get current vet's time slots
exports.getVetTimeSlots = async (req, res) => {
  try {
    const vetId = req.user.userId;
    const slots = await TimeSlot.find({ vet: vetId }).sort({ day: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ❌ Delete slot
exports.deleteTimeSlot = async (req, res) => {
  try {
    const vetId = req.user.userId;
    const result = await TimeSlot.findOneAndDelete({ _id: req.params.id, vet: vetId });

    if (!result) {
      return res.status(404).json({ error: 'Slot not found or not authorized' });
    }

    res.json({ message: 'Time slot deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find()
      .populate('vet', 'firstName lastName email') // Populate vet info
      .sort({ day: 1, startTime: 1 }); // Optional sorting

    res.json({ success: true, slots });
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
