const Project = require('../../models/project'); 
const User = require('../../models/User'); 
const Assignment = require('../../models/assignment'); 
// Get all projects
const getAllProjects = async (req, res) => {
    try {
        // Find all projects, and populate the managerId field with the manager's name and email
        // Only managers should be able to view all projects
        if (req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can view all projects.' });
        }

        const projects = await Project.find({})
            .populate('managerId', 'name email') // Populate manager's name and email
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: projects,
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching projects',
            error: error.message,
        });
    }
};

// Create a new project
const createProject = async (req, res) => {
    // Destructure project fields from the request body
    const { name, description, startDate, endDate, requiredSkills, teamSize, status, managerId } = req.body;

    // Basic validation
    if (!name || !description || !startDate || !endDate || !requiredSkills || teamSize === undefined || !status || !managerId) {
        return res.status(400).json({ success: false, message: 'All project fields are required.' });
    }

    // Additional validation (e.g., date formats, teamSize min/max, status enum)
    if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
    }
    if (!['planning', 'active', 'completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid project status.' });
    }
    if (typeof teamSize !== 'number' || teamSize < 1) {
        return res.status(400).json({ success: false, message: 'Team size must be a positive number.' });
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one required skill is needed.' });
    }

    try {
        // Check if the authenticated user is a manager (from authMiddleware)
        if (req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can create projects.' });
        }

        // Verify if the provided managerId exists and has the 'manager' role
        const manager = await User.findOne({ _id: managerId, role: 'manager' });
        if (!manager) {
            return res.status(404).json({ success: false, message: 'Assigned manager not found or is not a manager.' });
        }

        const newProject = new Project({
            name,
            description,
            startDate,
            endDate,
            requiredSkills,
            teamSize,
            status,
            managerId, // Store the manager's ID
        });

        const savedProject = await newProject.save();

        res.status(201).json({
            success: true,
            message: 'Project created successfully!',
            data: savedProject,
        });

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating project',
            error: error.message,
        });
    }
};


// Get project by ID (for editing or viewing details)
const getProjectById = async (req, res) => {
    try {
        if (req.user.role !== 'manager' && req.user.role !== 'engineer') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers or engineers can view projects.' });
        }

        const project = await Project.findById(req.params.id)
            .populate('managerId', 'name email')
            .lean();

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Project fetched successfully!',
            data: project,
        });
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching project',
            error: error.message,
        });
    }
};


// Update an existing project
const updateProject = async (req, res) => {
    const { id } = req.params; // Project ID from URL
    const { name, description, startDate, endDate, requiredSkills, teamSize, status, managerId } = req.body;

    // Basic validation
    if (!name || !description || !startDate || !endDate || !requiredSkills || teamSize === undefined || !status || !managerId) {
        return res.status(400).json({ success: false, message: 'All project fields are required for update.' });
    }
    // Additional validation (e.g., date formats, teamSize min/max, status enum)
    if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
    }
    if (!['planning', 'active', 'completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid project status.' });
    }
    if (typeof teamSize !== 'number' || teamSize < 1) {
        return res.status(400).json({ success: false, message: 'Team size must be a positive number.' });
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one required skill is needed.' });
    }


    try {
        // Only managers can update projects
        if (req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can update projects.' });
        }

        // Verify if the provided managerId exists and has the 'manager' role
        const manager = await User.findOne({ _id: managerId, role: 'manager' });
        if (!manager) {
            return res.status(404).json({ success: false, message: 'Assigned manager not found or is not a manager.' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, description, startDate, endDate, requiredSkills, teamSize, status, managerId },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        ).populate('managerId', 'name email').lean(); // Populate manager for response

        if (!updatedProject) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully!',
            data: updatedProject,
        });

    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating project',
            error: error.message,
        });
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params; // Project ID from URL

    try {
        // Only managers can delete projects
        if (req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can delete projects.' });
        }

        // Optional: Before deleting a project, you might want to handle its assignments.
        // For simplicity, we'll delete associated assignments.
        await Assignment.deleteMany({ projectId: id });

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ success: false, message: 'Project not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully!',
        });

    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting project',
            error: error.message,
        });
    }
};


module.exports = {
    getAllProjects,
    createProject,
    getProjectById, 
    updateProject, 
    deleteProject,  
};
