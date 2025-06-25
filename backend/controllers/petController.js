const Pet = require('../models/Pet');
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
// const Pet = require('../models/Pet');

// Create a pet
exports.createPet = async (req, res) => {
  try {
    const { name, species, breed, dob, gender } = req.body;
    const owner = req.user.userId;

    console.log("User from token:", req.user);

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`,
      {
        folder: `my_pets/${owner}`,
      }
    );

    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required.' });
    }

    const pet = new Pet({
      name,
      species,
      breed,
      dob,
      gender,
      image: result.secure_url,
      owner,
    });

    await pet.save();

    res.status(201).json({ message: 'Pet created successfully', pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all pets of the logged-in user
exports.getUserPets = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.userId);
    const pets = await Pet.find({ owner: ownerId });
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific pet by ID and owner
exports.getPetById = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.userId);
    const pet = await Pet.findOne({ _id: req.params.id, owner: ownerId });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { name, species, breed, dob, gender } = req.body;
    const owner = req.user.userId; // Assuming JWT middleware sets this

    console.log("User from token (update):", req.user);

    const updates = {
      name,
      species,
      breed,
      dob,
      gender,
    };

    // Optional: validate required fields for update
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required.' });
    }

    // If image is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`,
        {
          folder: `my_pets/${owner}`,
        }
      );
      updates.image = result.secure_url;
    }

    const updatedPet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner }, // Ensure pet belongs to user
      updates,
      { new: true, omitUndefined: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: 'Pet not found or not authorized' });
    }

    res.json({ message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete pet
exports.deletePet = async (req, res) => {
  try {

    const ownerId = new mongoose.Types.ObjectId(req.user.userId);
  
    const result = await Pet.findOneAndDelete({ _id: req.params.id, owner: ownerId});

    if (!result) {
      return res.status(404).json({ error: 'Pet not found or not authorized' });
    }

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
