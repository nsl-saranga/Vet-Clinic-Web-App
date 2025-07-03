const express = require('express');
const router = express.Router();
const { addTimeSlot, updateTimeSlot, getVetTimeSlots, deleteTimeSlot, getAllTimeSlots } = require('../controllers/timeSlotController');
const authMiddleware = require('../middleware/authenticate');
const requireVet = require('../middleware/validateVet');

router.post('/', authMiddleware, requireVet, addTimeSlot);
router.put('/:id', authMiddleware, requireVet, updateTimeSlot);
router.get('/mine', authMiddleware, requireVet, getVetTimeSlots);
router.delete('/:id', authMiddleware, requireVet, deleteTimeSlot);
router.get('/available', authMiddleware, getAllTimeSlots);

module.exports = router;
