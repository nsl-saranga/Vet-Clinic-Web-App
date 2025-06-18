const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'vet', 'admin'], default: 'client' }
});

module.exports = mongoose.model('User', userSchema);


