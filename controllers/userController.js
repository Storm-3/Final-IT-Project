// controllers/userController.js
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../models");
const Users = db.Users;
const { sendEmail } = require("./middleware/emailVer"); // your existing email module
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "yourSecretKey";

// Create anonymous or named user
exports.CreateAvgUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    userData.sendbird_id = uuidv4();
    // userData.role_id = 1; 

    // Detect if user is "named" (provided email and password)
    const isNamedUser = userData.email && userData.password;

    if (isNamedUser) {
      // Named user
      userData.is_anonymous = false;

      // Hash password
      userData.password = await bcrypt.hash(userData.password, 10);

      // Generate verification token
      const token = crypto.randomBytes(20).toString("hex");
      userData.verificationToken = token;
    } else {
      // Anonymous user
      userData.is_anonymous = true;
      userData.name = userData.name || `Guest_${Date.now()}`;
      userData.email = `guest_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}@example.com`;
      userData.password = null;
      userData.isEmailVerified = false;
      userData.status = "active"; // allow immediate login
    }

    // Always generate unique SendBird ID
    userData.sendbird_id = uuidv4();

    console.log("🔥 Creating user with data:", userData);

    const newUser = await Users.create(userData);
    console.log("✅ User created with ID:", newUser.id);

    // Send verification email only for named users
    if (isNamedUser) {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newUser.verificationToken}`;
      const html = `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`;
      try {
        await sendEmail(newUser.email, "Verify Your Email", html);
      } catch (emailErr) {
        console.warn(
          "Failed sending verification email:",
          emailErr.message || emailErr
        );
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, role_id: newUser.role_id },
      secretKey,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_anonymous: newUser.is_anonymous,
        role_id: newUser.role_id,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.GetAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password", "verificationToken"] },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get single user by ID
exports.GetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password", "verificationToken"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update user by ID
exports.UpdateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const [updatedRows] = await Users.update(updates, { where: { id } });
    if (!updatedRows) return res.status(404).json({ error: "User not found" });

    const updatedUser = await Users.findByPk(id, {
      attributes: { exclude: ["password", "verificationToken"] },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete user by ID
exports.DeleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Users.destroy({ where: { id } });
    if (!deletedRows) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.viewCounsellors = async (req, res) => {
  try {
    const counsellors = await Users.findAll({
      where: { role_id: 2 }, // Assuming 2 = counsellor
      attributes: ['id', 'name', 'email'] // Add more if needed
    });

    res.status(200).json({ counsellors });
  } catch (error) {
    console.error('Error fetching counsellors:', error);
    res.status(500).json({ error: 'Failed to fetch counsellors' });
  }
};
