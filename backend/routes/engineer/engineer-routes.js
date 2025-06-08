// backend/routes/engineer/engineer-routes.js
const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/Engineer/engineer'); // Correct path
const { authMiddleware } = require('../../middleware/auth'); // Correct path

// Engineer/User Routes
// GET all users (engineers and managers) - used by frontend to then filter by role
router.get('/', authMiddleware, engineerController.getAllEngineers);
router.get('/users', authMiddleware, engineerController.getAllUsers);


// GET specific engineer details by ID
router.get('/:id', authMiddleware, engineerController.getEngineerById);

module.exports = router;
