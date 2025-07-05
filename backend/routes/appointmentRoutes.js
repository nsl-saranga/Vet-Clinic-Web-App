const express = require('express');
const router = express.Router();

const {createAppointment, getAppointments, updateAppointmentStatus, cancelAppointment, submitMissedReason, submitReview} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authenticate');


router.post('/', authMiddleware, createAppointment);
router.get('/', authMiddleware, getAppointments);
router.put('/:id/status', authMiddleware, updateAppointmentStatus);
router.delete('/:id', authMiddleware, cancelAppointment); 
router.put('/:id/missed-reason', authMiddleware, submitMissedReason);
router.put('/:id/review', authMiddleware, submitReview);



module.exports = router;
