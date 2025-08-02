const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },

  alertType: { 
    type: String, 
    required: true,
    enum: ['Accident', 'Protest', 'Fire', 'Roadblock', 'Crime', 'Other']
  },

  description: { 
    type: String, 
    required: true 
  },

  imageUrl: { 
    type: String 
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  
      required: true
    }
  },

  timestamp: {
    type: Date,
    default: Date.now
  },

  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  }
});

alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
