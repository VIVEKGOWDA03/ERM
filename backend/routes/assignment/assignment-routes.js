// backend/routes/assignment-routes.js
const express = require("express");
const router = express.Router();
const assignmentController = require("../../controllers/Assignment/asignment");
const { authMiddleware } = require("../../middleware/auth");

// Assignment Routes
router.get("/", authMiddleware, assignmentController.getAllAssignments); // For managers (or all)
router.get(
  "/my/:engineerId",
  authMiddleware,
  assignmentController.getMyAssignments
);
router.post("/new", authMiddleware, assignmentController.createAssignment); // For engineers to create assignments

module.exports = router;
