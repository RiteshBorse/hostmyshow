import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  },
  review: {
    type: String,
    required: true,
  },
   sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
  score : {
    type : Number
  } 
},{ timestamps: true });

export default mongoose.model("Review", reviewSchema);
