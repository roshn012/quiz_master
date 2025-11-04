const express = require("express");
const mongoose = require("mongoose");
const Result = require("../models/resultModel");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /results/submit
 * @desc    Save a user's quiz result
 * @access  Private
 */
router.post("/submit", protect, async (req, res) => {
  try {
    console.log("🔐 Incoming token:", req.headers.authorization);
    console.log("👤 Authenticated user:", req.user?._id, req.user?.email);

    const { quiz, score, totalQuestions, correctAnswers } = req.body;

    if (!quiz || score == null)
      return res.status(400).json({ message: "Missing quiz or score data" });

    // ✅ Ensure user ID is always stored as ObjectId
    const result = await Result.create({
      user: new mongoose.Types.ObjectId(req.user._id),
      quiz,
      score,
      totalQuestions,
      correctAnswers,
    });

    res.status(201).json({
      message: "Result submitted successfully",
      result,
    });
  } catch (err) {
    console.error("❌ Error submitting result:", err.message);
    res.status(500).json({ message: "Failed to submit result" });
  }
});

/**
 * @route   GET /results/my-results
 * @desc    Get the logged-in user's recent quiz results
 * @access  Private
 */
router.get("/my-results", protect, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate("quiz", "title")
      .sort({ submittedAt: -1 })
      .limit(5);

    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching user results:", err.message);
    res.status(500).json({ message: "Failed to load results" });
  }
});

/**
 * @route   GET /results/leaderboard
 * @desc    Get top performers by total score with rankings
 * @access  Public
 */
router.get("/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Allow custom limit, default 10
    
    const leaderboard = await Result.aggregate([
      // 1️⃣ Filter out invalid data
      {
        $match: {
          user: { $exists: true, $ne: null },
          score: { $exists: true, $ne: null },
        },
      },
      // 2️⃣ Get each user's best score per quiz
      {
        $group: {
          _id: { user: "$user", quiz: "$quiz" },
          bestScore: { $max: "$score" },
        },
      },
      // 3️⃣ Sum total score per user
      {
        $group: {
          _id: "$_id.user",
          totalScore: { $sum: "$bestScore" },
          quizzesCompleted: { $sum: 1 },
        },
      },
      // 4️⃣ Filter users with valid scores
      {
        $match: {
          totalScore: { $gt: 0 },
        },
      },
      // 5️⃣ Join with users collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 6️⃣ Flatten user array
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false, // Only include users that exist
        },
      },
      // 7️⃣ Add readable user fields
      {
        $addFields: {
          name: { $ifNull: ["$user.name", "Unknown User"] },
          username: {
            $ifNull: [
              { $arrayElemAt: [{ $split: ["$user.email", "@"] }, 0] },
              "unknown",
            ],
          },
          email: { $ifNull: ["$user.email", "N/A"] },
        },
      },
      // 8️⃣ Final projection
      {
        $project: {
          _id: 0,
          name: 1,
          username: 1,
          email: 1,
          totalScore: { $round: ["$totalScore", 2] }, // Round to 2 decimal places
          quizzesCompleted: 1,
        },
      },
      // 9️⃣ Sort by total score (descending), then by quizzes completed (descending)
      { $sort: { totalScore: -1, quizzesCompleted: -1 } },
      // 🔟 Limit results
      { $limit: limit },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("❌ Leaderboard error:", err.message);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err.message });
  }
});

module.exports = router;
