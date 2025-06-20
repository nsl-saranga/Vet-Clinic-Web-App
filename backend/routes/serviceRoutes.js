const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createService, getAllServices } = require('../controllers/serviceController');

router.post('/services', upload.single('image'), createService);  // POST
router.get('/services', getAllServices);                          // GET

module.exports = router;
