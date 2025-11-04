const express = require("express");
const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Add question to a quiz
router.post("/:quizId", protect, adminOnly, async (req, res) => {
  try {
    const { questionText, options } = req.body;
    const question = await Question.create({ questionText, options, quiz: req.params.quizId });
    await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: question._id } });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions by quiz
router.get("/:quizId", protect, async (req, res) => {
  const questions = await Question.find({ quiz: req.params.quizId });
  res.json(questions);
});

module.exports = router;
