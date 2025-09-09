import mongoose from 'mongoose';

const seatLockSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  seatLabel: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lockedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
  },
  sessionId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Compound index to ensure one lock per seat per event
seatLockSchema.index({ event_id: 1, seatLabel: 1 }, { unique: true });

// Method to check if lock is still valid
seatLockSchema.methods.isValid = function() {
  return new Date() < this.expiresAt;
};

export const SeatLock = mongoose.model('SeatLock', seatLockSchema);
