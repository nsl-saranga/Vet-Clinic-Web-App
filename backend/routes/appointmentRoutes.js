const express = require('express');
const router = express.Router();

const {createAppointment, getAppointments, updateAppointmentStatus, cancelAppointment} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authenticate');


router.post('/', authMiddleware, createAppointment);
router.get('/', authMiddleware, getAppointments);
router.put('/:id/status', authMiddleware, updateAppointmentStatus);
router.delete('/:id', authMiddleware, cancelAppointment); 


module.exports = router;
