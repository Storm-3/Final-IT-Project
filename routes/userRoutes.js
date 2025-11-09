// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authToken = require("../controllers/middleware/authToken");

// PROTECTED: CRUD for users
router.get("/", authToken, userController.GetAllUsers);
router.get("/counsellors", authToken, userController.viewCounsellors);
router.get("/:id", authToken, userController.GetUserById);
router.put("/:id", authToken, userController.UpdateUserById);
router.delete("/:id", authToken, userController.DeleteUserById);

module.exports = router;
