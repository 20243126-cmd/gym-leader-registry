
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const GymLeader = require('./models/GymLeader');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check MongoDB ID format
const isValidId = (id) => mongoose.isValidObjectId(id);

// Home route
app.get('/', (req, res) => {
  res.send('Gym Leader Registry API is running!');
});

// GET all gym leaders
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find().sort({ createdAt: -1 });
    res.status(200).json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gym leaders.' });
  }
});

// GET one gym leader
app.get('/api/leaders/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Gym Leader ID.' });
    }

    const leader = await GymLeader.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({ message: 'Gym Leader not found.' });
    }

    res.status(200).json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gym leader.' });
  }
});

// POST a new gym leader
app.post('/api/leaders', async (req, res) => {
  try {
    const leader = new GymLeader(req.body);
    const savedLeader = await leader.save();

    res.status(201).json(savedLeader);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a gym leader
app.put('/api/leaders/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Gym Leader ID.' });
    }

    const updatedLeader = await GymLeader.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found.' });
    }

    res.status(200).json(updatedLeader);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a gym leader
app.delete('/api/leaders/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Gym Leader ID.' });
    }

    const deletedLeader = await GymLeader.findByIdAndDelete(req.params.id);

    if (!deletedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found.' });
    }

    res.status(200).json({
      message: 'Gym Leader deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gym leader.' });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Connect to MongoDB, then start server
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
  .then(() => {
    console.log('Connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
