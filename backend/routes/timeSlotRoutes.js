const express = require('express');
const router = express.Router();
const { addTimeSlot, updateTimeSlot, getVetTimeSlots, deleteTimeSlot, getAllTimeSlots } = require('../controllers/timeSlotController');
const authMiddleware = require('../middleware/authenticate');
const requireVet = require('../middleware/validateVet');
const checkRole = require('../middleware/checkRole');

router.post('/', authMiddleware, checkRole("vet"), addTimeSlot);
router.put('/:id', authMiddleware,  checkRole("vet"), updateTimeSlot);
router.get('/mine', authMiddleware,  checkRole("vet"), getVetTimeSlots);
router.delete('/:id', authMiddleware,  checkRole("vet"), deleteTimeSlot);
router.get('/available', authMiddleware, getAllTimeSlots);

module.exports = router;
