const Assignment = require('../../models/assignment'); // Adjust path as needed
const Project = require('../../models/project');     // For populating project details
const User = require('../../models/User');           // For populating engineer details

// Get all assignments (for manager)
const getAllAssignments = async (req, res) => {
    try {
        // Access control: Only managers should be able to view all assignments
        if (req.user.role !== 'manager') {
            console.warn(`Access denied for user ${req.user.email} (role: ${req.user.role}) trying to view all assignments.`);
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can view all assignments.' });
        }

        const assignments = await Assignment.find({})
            .populate('engineerId', 'name email maxCapacity seniority skills department') // Include department as per schema
            .populate('projectId', 'name description status startDate endDate')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Assignments fetched successfully',
            data: assignments,
        });
    } catch (error) {
        console.error('Error fetching all assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching all assignments',
            error: error.message,
        });
    }
};

// Get assignments for a specific engineer (for engineer dashboard/profile)
const getMyAssignments = async (req, res) => {
    try {
        const requestedEngineerId = req.params.engineerId; // ID from URL param
        const loggedInUserId = req.user.id;
        const loggedInUserRole = req.user.role;

        // Security check: An engineer can ONLY view their own assignments.
        // A manager CAN view any engineer's assignments (if routed through this endpoint).
        if (loggedInUserRole === 'engineer' && loggedInUserId !== requestedEngineerId) {
            console.warn(`Access denied: Engineer ${loggedInUserId} tried to view assignments for ${requestedEngineerId}.`);
            return res.status(403).json({ success: false, message: 'Access denied. You can only view your own assignments.' });
        }

        // If the logged-in user is an engineer, they implicitly request their own assignments.
        // If the logged-in user is a manager, they can request any engineer's assignments via the URL parameter.
        const targetEngineerId = loggedInUserRole === 'engineer' ? loggedInUserId : requestedEngineerId;

        if (!targetEngineerId) {
             return res.status(400).json({ success: false, message: 'Engineer ID is required for this operation.' });
        }

        const assignments = await Assignment.find({ engineerId: targetEngineerId })
            .populate('engineerId', 'name email maxCapacity seniority skills department') // Keep details needed by frontend
            .populate('projectId', 'name description status startDate endDate')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Assignments fetched successfully',
            data: assignments,
        });

    } catch (error) {
        console.error('Error fetching specific engineer assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching assignments',
            error: error.message,
        });
    }
};

// NEW: Create a new assignment
const createAssignment = async (req, res) => {
    try {
        // Only managers should be able to create assignments
        if (req.user.role !== 'manager') {
            return res.status(403).json({ success: false, message: 'Access denied. Only managers can create assignments.' });
        }

        const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;

        // Basic validation (more comprehensive validation can be done with Joi/Express-validator)
        if (!engineerId || !projectId || allocationPercentage === undefined || !startDate || !endDate || !role) {
            return res.status(400).json({ success: false, message: 'All assignment fields are required.' });
        }

        // Optional: Add more business logic validation here, e.g.:
        // - Check if engineer and project IDs are valid
        // - Check if allocationPercentage is within 0-100
        // - Check for date overlaps or illogical dates

        const newAssignment = new Assignment({
            engineerId,
            projectId,
            allocationPercentage,
            startDate,
            endDate,
            role,
        });

        const savedAssignment = await newAssignment.save();

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully!',
            data: savedAssignment,
        });

    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating assignment',
            error: error.message,
        });
    }
};

module.exports = {
    getAllAssignments,
    getMyAssignments,
    createAssignment, // Export the new function
    // ... other assignment exports (e.g., updateAssignment, deleteAssignment)
};
