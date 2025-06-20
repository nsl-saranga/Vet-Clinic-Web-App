const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  reasons: [String],
  subservices: [String],
  whenToSeekDoctor: [String]
});
module.exports = mongoose.model('Service', serviceSchema);
