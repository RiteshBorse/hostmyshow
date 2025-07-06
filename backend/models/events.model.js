import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  eventType: {
    type: String,
    enum: ['show', 'hackathon'],
    required: true
  },
  banner: {
    type: String, 
    required: true
  },
  image: {
  type: String,
  required: false
  },
  eventDateTime: [{
    type:Date,
    required: true
  }],
  seats: {
    type: String,
    enum: ['RowColumns', 'direct']
  },
  seatMap: [
  {
    seatLabel: String,        
    isBooked: { type: Boolean, default: false }
  }
],
  cost: {
    type: Number,
    default: 0
  },
  certificate: {
    type: Boolean
  },
  special: {
    type: String,
    enum: ['spotlight', 'prime', 'elite', 'special', 'sponsored']
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

export const Event = mongoose.model('Event', eventSchema);
 
