/**
 * Script to create the first admin user
 * Run with: node backend/scripts/createAdmin.js
 * Or use: npm run create-admin
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/userModel");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/quizapp");
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.argv[2] || "admin@quizmaster.com";
    const adminPassword = process.argv[3] || "admin123";
    const adminName = process.argv[4] || "Admin User";

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      if (existing.role === "admin") {
        console.log("ℹ️  Admin user already exists with this email");
        process.exit(0);
      } else {
        // Update existing user to admin
        existing.role = "admin";
        await existing.save();
        console.log("✅ Existing user upgraded to admin");
        process.exit(0);
      }
    }

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Name: ${adminName}`);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

