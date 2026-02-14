require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/Admin");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

async function createAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("❌ Admin already exists with email:", ADMIN_EMAIL);
      console.log("   To create a different admin, edit createAdmin.js with new credentials");
      process.exit(0);
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin
    console.log("👤 Creating admin account...");
    const newAdmin = new Admin({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      lastLogin: null
    });

    await newAdmin.save();
    
    console.log("\n✅ SUCCESS! Admin created:");
    console.log("   Email:", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("\n📝 Next steps:");
    console.log("   1. Go to your frontend dashboard");
    console.log("   2. Login with these credentials");
    console.log("   3. Your admin profile will appear on the dashboard");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
