const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createService, getAllServices, getServiceById } = require('../controllers/serviceController');

router.post('/services', upload.single('image'), createService);  // POST
router.get('/services', getAllServices);                          // GET

// 👇 New route to get service by name
router.get('/services/:id', getServiceById);

module.exports = router;
