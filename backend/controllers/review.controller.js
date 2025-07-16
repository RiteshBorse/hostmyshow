import Review from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

const addReview = asyncHandler(async (req, res) => {
  const { event_id, review } = req.body;

  if (!event_id || !review) {
    return res.status(400).send({
      message: "Event ID and review are required",
      success: false
    });
  }

  const user_id = req.user.id;

  const result = sentiment.analyze(review);
  let sentimentCategory = "neutral";

  if (result.score > 1) sentimentCategory = "positive";
  else if (result.score < -1) sentimentCategory = "negative";


  const newReview = new Review({ event_id, user_id, review, sentiment: sentimentCategory , score: result.score });
  await newReview.save();

  res.status(201).send({
    message: `Review added successfully.`,
    success: true
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const { event_id } = req.params;

  if (!event_id) {
    return res.status(400).send({
      message: "Event ID is required",
      success: false
    });
  }

  const reviews = await Review.find({ event_id });

  const categorized = {
    positive: [],
    neutral: [],
    negative: []
  };

  reviews.forEach(review => {
    categorized[review.sentiment].push(review);
  });

  res.status(200).send({
    message: "Reviews fetched successfully",
    success: true,
    data: categorized
  });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).send({
    message: "All reviews fetched successfully",
    success: true,
    data: reviews
  });
});


export{getReviews , addReview , getAllReviews};