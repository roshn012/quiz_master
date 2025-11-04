const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
