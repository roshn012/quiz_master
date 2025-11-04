const express = require("express");
const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create quiz (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, difficulty, questions = [], timeLimit } = req.body;

    // 1) Create the quiz without questions first
    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      createdBy: req.user._id,
      questions: [],
    });

    // 2) Create Question docs and link them to this quiz
    if (Array.isArray(questions) && questions.length > 0) {
      const questionDocs = await Question.insertMany(
        questions.map((q) => ({
          questionText: q.questionText,
          options: Array.isArray(q.options) ? q.options.map((opt) => ({
            text: opt.text,
            isCorrect: !!opt.isCorrect,
          })) : [],
          quiz: quiz._id,
        }))
      );

      // 3) Update quiz with created question IDs
      quiz.questions = questionDocs.map((doc) => doc._id);
      await quiz.save();
    }

    const populated = await Quiz.findById(quiz._id).populate("questions");
    res.json(populated);
  } catch (err) {
    console.error("Create quiz error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get all quizzes
router.get("/", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single quiz
router.get("/:id", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quiz (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Check if user created this quiz or is admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this quiz" });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete quiz (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Check if user created this quiz or is admin
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this quiz" });
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quiz: quiz._id });
    
    // Delete the quiz
    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
