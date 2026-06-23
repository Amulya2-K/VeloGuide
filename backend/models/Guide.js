const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },   
  password: { 
    type: String, 
    required: true 
  },               
  
  assignedCity: { 
    type: String, 
    required: true 
  },
  languages: { 
    type: [String], 
    required: true 
  },
  policeClearanceId: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Verified by Local Authorities' 
  },
  isUnemployedLocal: { 
    type: Boolean, 
    default: true 
  }
});

module.exports = mongoose.model('Guide', GuideSchema);