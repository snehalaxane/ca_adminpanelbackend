const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN REQUEST BODY:", req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 CREATE SESSION HERE
    req.session.admin = {
      id: admin._id,
      email: admin.email,
      lastLogin: new Date(),
    };

    res.json({
      success: true,
      message: "Admin login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    email: req.session.admin.email,
    lastLogin: req.session.admin.lastLogin,
  });
};
