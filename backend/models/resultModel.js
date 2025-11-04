const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: { type: Number, required: true },
    totalQuestions: { type: Number },
    correctAnswers: { type: Number },
    timeTaken: { type: Number }, // in seconds
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
