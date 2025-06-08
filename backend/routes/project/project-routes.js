// backend/routes/project-routes.js
const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project/project'); 
const { authMiddleware } = require('../../middleware/auth');

// Project Routes
router.get('/projects', authMiddleware, projectController.getAllProjects);
router.post('/projects', authMiddleware, projectController.createProject);
router.get('/projects/:id', authMiddleware, projectController.getProjectById);
router.put('/projects/:id', authMiddleware, projectController.updateProject);
router.delete('/projects/:id', authMiddleware, projectController.deleteProject);
module.exports = router;
