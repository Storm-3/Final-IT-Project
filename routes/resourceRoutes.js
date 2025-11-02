// routes/resourceRoutes.js
const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

// PUBLIC: Anyone can view resources
router.post("/", resourceController.CreateResource);
router.get("/", resourceController.GetAllResources);
router.get("/:id", resourceController.GetResourceById);
router.put("/:id", resourceController.UpdateResourceById); // ← CORRECT NAME
router.delete("/:id", resourceController.DeleteResourceById);

module.exports = router;
