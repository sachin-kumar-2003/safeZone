const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  passwordHash: { 
    type: String, 
    required: true 
  },

  trustScore: { 
    type: Number, 
    default: 50 
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      default: [0, 0]
    }
  },

  socketId: {
    type: String  
  }
});


userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
