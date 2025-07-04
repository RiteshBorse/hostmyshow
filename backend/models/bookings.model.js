import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking_dateTime: {
    type: Date,
    required: true
  },
  seats: {
    type: String,
    required: true
  },
  ticket_redeem: {
    type: Boolean,
    default: false
  },
  event_status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  payment_id: {
    type: String,
    required: true
  },
  paymentAmt: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
