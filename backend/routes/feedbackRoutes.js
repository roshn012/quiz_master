const express = require("express");
const Feedback = require("../models/feedbackModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ➕ Add feedback for a quiz
router.post("/:quizId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Prevent duplicate feedback from the same user
    const existing = await Feedback.findOne({ user: req.user._id, quiz: req.params.quizId });
    if (existing) {
      return res.status(400).json({ message: "You already submitted feedback for this quiz" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      quiz: req.params.quizId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📜 Get all feedback for a specific quiz
router.get("/:quizId", protect, async (req, res) => {
  try {
    const feedback = await Feedback.find({ quiz: req.params.quizId })
      .populate("user", "name email");
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
