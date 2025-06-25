const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authenticate');
const upload = require('../middleware/upload');

// Use per-route authentication to control execution order
router.post('/', authMiddleware, upload.single('image'), petController.createPet);
router.get('/', authMiddleware, petController.getUserPets);
router.get('/:id', authMiddleware, petController.getPetById);
router.put('/:id', authMiddleware, upload.single('image'), petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
