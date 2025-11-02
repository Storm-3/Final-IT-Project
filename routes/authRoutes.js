// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// PUBLIC: Register (named or anonymous)
router.post("/", userController.CreateAvgUser);

// PUBLIC: Anonymous only
router.post("/anonymous", userController.CreateAvgUser);

// PUBLIC: Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await require("../models").Users.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user || user.is_anonymous)
      return res.status(401).json({ error: "Invalid credentials" });

    const valid = await require("bcrypt").compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = require("jsonwebtoken").sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
