const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    assignedCity: {
        type: String,
        required: true,
        trim: true
    },

    assignedCityKey: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },

    languages: {
        type: [String],
        required: true
    },

    bio: {
        type: String,
        default:
            'Passionate local guide eager to show you hidden gems, local flavors, and rich heritage.'
    },

    avatar: {
        type: String,
        default:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },

    hourlyRate: {
        type: Number,
        default: 500
    },

    rating: {
        type: Number,
        default: 4.9
    },

    reviewCount: {
        type: Number,
        default: 24
    },

    specialties: {
        type: [String],
        default: [
            'History',
            'Food Tours',
            'Culture & Heritage'
        ]
    },

    experienceYears: {
        type: Number,
        default: 3
    },

    availability: {
        type: String,
        default: 'Available'
    },

    phone: {
        type: String,
        default: '+91 98765 43210'
    },

    status: {
        type: String,
        default: 'Verified Local Guide'
    },

    isUnemployedLocal: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Guide', GuideSchema);