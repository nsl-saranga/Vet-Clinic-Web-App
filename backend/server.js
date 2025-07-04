const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const petRoutes = require('./routes/petRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
app.use(cors(
  {origin: 'http://localhost:3000', // Adjust this to your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}
));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', serviceRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/appointments', appointmentRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
