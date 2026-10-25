
const mongoose = require('mongoose');

const gymLeaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Leader name is required.'],
      minlength: [2, 'Name must be at least 2 characters.'],
      trim: true
    },
    region: {
      type: String,
      required: [true, 'Region is required.'],
      enum: ['Kanto', 'Johto', 'Hoenn']
    },
    town: {
      type: String,
      required: [true, 'Town is required.'],
      trim: true
    },
    badge: {
      type: String,
      required: [true, 'Badge is required.'],
      trim: true
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required.'],
      trim: true
    },
    aceLevel: {
      type: Number,
      required: [true, 'Ace level is required.'],
      min: [1, 'Ace level must be at least 1.'],
      max: [100, 'Ace level cannot exceed 100.'],
      validate: {
        validator: Number.isInteger,
        message: 'Ace level must be a whole number.'
      }
    },
    motto: {
      type: String,
      maxlength: [150, 'Motto cannot exceed 150 characters.'],
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GymLeader', gymLeaderSchema);
