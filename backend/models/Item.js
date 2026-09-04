const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Item title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        required: true,
        enum: ['Tools', 'Electronics', 'Kitchen', 'Gardening', 'Other']
    },
    images: [{
        type: String
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    status: {
        type: String,
        enum: ['available', 'borrowed', 'maintenance'],
        default: 'available'
    }
}, { timestamps: true });

// Geospatial index for finding items nearby
itemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Item', itemSchema);
