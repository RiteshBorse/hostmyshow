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
    type: {
      type: String,
      enum: ['RowColumns', 'direct'],
      required: true
    },
    value: String
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
 
