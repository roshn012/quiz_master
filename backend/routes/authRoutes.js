const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

const OTP = require("../models/otpModel");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role: role || "user" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    (async () => {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Welcome to Quiz Master, ${name || 'User'}!`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color:#4f46e5;">Welcome to Quiz Master</h2>
              <p>Hi ${name || ''},</p>
              <p>Thanks for signing up — we're excited to have you on board. You can now login and start taking quizzes.</p>
              <p style="margin-top:12px">If you ever need help, reply to this email.</p>
              <p style="color:#777; font-size:12px; margin-top:20px">— The Quiz Master Team</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error('Welcome email failed:', emailErr);
      }
    })();

    res.json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If email exists, OTP has been sent" });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "If email exists, OTP has been sent" });
  } catch (err) {
    console.error("Error in /forgot-password:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });

    if (!stored) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > stored.expiresAt) {
      await OTP.deleteOne({ _id: stored._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    stored.verified = true;
    await stored.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const stored = await OTP.findOne({ email, otp, verified: true }).sort({ createdAt: -1 });

    if (!stored) {
      return res.status(400).json({ message: "OTP not found or not verified" });
    }

    if (Date.now() > stored.expiresAt) {
      await OTP.deleteOne({ _id: stored._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
