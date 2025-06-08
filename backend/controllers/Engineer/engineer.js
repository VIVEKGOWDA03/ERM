const User = require("../../models/User"); // Your User model
const Assignment = require("../../models/assignment"); // Your Assignment model

// Get all engineers WITH their project and assignment details
const getAllEngineers = async (req, res) => {
  try {
    // Only managers should be able to view all engineers with detailed assignments
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Access denied. Only managers can view engineers with details.",
        });
    }

    // 1. Fetch all users with the 'engineer' role
    const engineers = await User.find({ role: "engineer" }).lean();

    // 2. Fetch all assignments and populate project details
    // We'll filter these assignments per engineer in the next step
    const allAssignments = await Assignment.find({})
      .populate(
        "projectId",
        "name description status startDate endDate requiredSkills"
      ) // Populate project details
      .lean();

    // 3. Manually attach assignments to each engineer
    const engineersWithDetails = engineers.map((engineer) => {
      const engineerAssignments = allAssignments.filter(
        (assignment) => String(assignment.engineerId) === String(engineer._id)
      );

      // Filter for only active assignments (optional, but useful for capacity)
      const activeAssignments = engineerAssignments.filter(
        (assignment) =>
          new Date(assignment.endDate) >= new Date() &&
          new Date(assignment.startDate) <= new Date()
      );

      // Calculate current allocation (simplified for this view, your frontend does more detailed capacity)
      const allocatedPercentage = activeAssignments.reduce(
        (sum, assignment) => sum + (assignment.allocationPercentage || 0),
        0
      );

      return {
        ...engineer,
        assignments: engineerAssignments, // All assignments for this engineer
        activeAssignments: activeAssignments, // Only currently active ones
        currentAllocatedPercentage: allocatedPercentage,
      };
    });

    res.status(200).json({
      success: true,
      message: "Engineers with details fetched successfully",
      data: engineersWithDetails,
    });
  } catch (error) {
    console.error("Error fetching engineers with details:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching engineers with details",
      error: error.message,
    });
  }
};

// Get engineer details by ID (e.g., for manager to view an engineer's profile)
const getEngineerById = async (req, res) => {
  try {
    // Managers can view any engineer. Engineers can only view their own profile.
    if (
      req.user.role === "engineer" &&
      String(req.user.id) !== String(req.params.id)
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. You can only view your own profile.",
        });
    }

    // Find the engineer by ID and ensure their role is 'engineer'
    const engineer = await User.findOne({
      _id: req.params.id,
      role: "engineer",
    }).lean();

    if (!engineer) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Engineer not found or user is not an engineer.",
        });
    }

    // Fetch assignments for this specific engineer
    const assignments = await Assignment.find({ engineerId: engineer._id })
      .populate("projectId", "name description status startDate endDate") // Populate project details
      .lean();

    // Attach assignments to the engineer object
    const engineerWithAssignments = {
      ...engineer,
      assignments: assignments,
    };

    res.status(200).json({
      success: true,
      message: "Engineer details fetched successfully",
      data: engineerWithAssignments,
    });
  } catch (error) {
    console.error("Error fetching engineer by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching engineer details",
      error: error.message,
    });
  }
};

// Get all users (engineers and managers) - no deep population
const getAllUsers = async (req, res) => {
  try {
    // Only managers should typically be able to view all users.
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Only managers can view all users.",
        });
    }

    // Fetch all users, regardless of role
    const users = await User.find({}).lean();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  getAllEngineers, // Export the updated function to get engineers with details
  getEngineerById, // Export the updated function for single engineer with assignments
  getAllUsers, // Export the function for general user list
};
