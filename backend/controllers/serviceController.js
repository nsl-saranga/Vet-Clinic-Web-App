const Service = require('../models/Service');
const cloudinary = require('../utils/cloudinary');

exports.createService = async (req, res) => {
  try {
    const { name, description, reasons, subServices, whenToSeekDoctor } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${req.file.buffer.toString("base64")}`, {
      folder: "vet_services",
    });

    // Save to MongoDB
    const newService = new Service({
      name,
      image: result.secure_url,
      description,
      reasons: JSON.parse(reasons),
      subservices: JSON.parse(subServices),
      whenToSeekDoctor: JSON.parse(whenToSeekDoctor),
    });

    await newService.save();
    res.status(201).json({ message: 'Service created', service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findOne({ _id: serviceId });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
