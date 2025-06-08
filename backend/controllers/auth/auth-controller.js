// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../../models/User");
// const cloudinary = require("../../helpers/cloud");

// // Register User
// const registerUser = async (req, res) => {
//   const { userName, email, password } = req.body;
//   console.log("req.body", req.body);

//   // Validate input
//   if (!userName || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields are required",
//     });
//   }

//   try {
//     // Check if user already exists by email or userName
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User with this email or username already exists",
//       });
//     }

//     // Hash password and create a new user
//     const hashPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({
//       userName,
//       email,
//       password: hashPassword,
//     });

//     // Save user to the database
//     const user = await newUser.save();
//     console.log(user);

//     // Return success response
//     res.status(201).json({
//       success: true,
//       message: "Registration Successful",
//       data: user,
//     });
//   } catch (e) {
//     console.error("Error during registration:", e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred during registration",
//     });
//   }
// };

// // Login User
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const checkUser = await User.findOne({ email });
//     if (!checkUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User doesn't exist! Please register first.",
//       });
//     }

//     const checkPasswordMatch = await bcrypt.compare(
//       password,
//       checkUser.password
//     );
//     if (!checkPasswordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect Password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: checkUser._id,
//         role: checkUser.role,
//         email: checkUser.email,
//         userName: checkUser.userName,
//       },
//       "CLIENT_SECRET_KEY",
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Logged in successfully",
//       token,
//       user: {
//         id: checkUser._id,
//         userName: checkUser.userName,
//         email: checkUser.email,
//         role: checkUser.role,
//         profilePic: checkUser.profilePic || "",
//         address: checkUser.address || "",
//         designation: checkUser.designation || "",
//         phoneNumber: checkUser.phoneNumber || "",
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred during login",
//     });
//   }
// };

// // logout
// const logoutUser = (req, res) => {
//   res.clearCookie("token").json({
//     success: true,
//     message: "logged out",
//   });
// };

// //auth middleware

// const authMiddleware = async (req, res, next) => {
//   // Use req.cookies instead of req.cookie
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized User!",
//     });

//   try {
//     // Verify the token using jwt
//     const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
//     req.user = decoded; // Attach user data to the request
//     next(); // Continue to the next middleware or route handler
//   } catch (error) {
//     // If token verification fails
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized User!",
//     });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     console.log("Decoded user ID:", req.user?.id); // Should output the user id

//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is missing" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Profile picture is required" });
//     }

//     // Upload the image to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "user_profiles",
//     });

//     // Update the user's profile picture in the database
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: result.secure_url },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       profilePic: updatedUser.profilePic,
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };
// const additionalDetails = async (req, res) => {
//   try {
//     const userId = req.params.id; // Get user ID from request parameters
//     const { address, designation, phoneNumber } = req.body;

//     // Validate required fields
//     if (!address || !designation || !phoneNumber) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Update user details
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { address, designation, phoneNumber },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json({
//       message: "User details updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating user details:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

// const getUser = async (req, res) => {
//   try {
//     // Extract userId from req.user (set by authMiddleware)
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is missing from token",
//       });
//     }

//     // Fetch user details from the database
//     // You can select the fields you want to return (e.g., userName, email, role, etc.)
//     const user = await User.findById(userId).select(
//       "userName email role profilePic address phoneNumber designation"
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User fetched successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error,
//     });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   authMiddleware,
//   updateProfile,
//   additionalDetails,
//   getUser,
// };



const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User"); // Assuming this path is correct

// NOTE: cloudinary import has been removed as profilePic is not in the provided User schema.
// If you plan to use cloudinary and profile pictures, you will need to add `profilePic: String` to your User schema
// and re-implement the updateProfile function.

// Register User
const registerUser = async (req, res) => {
  // Destructure required fields from the User schema
  const { name, email, password, role, skills, seniority, maxCapacity, department } = req.body;
  console.log("Registration request body:", req.body);

  // Validate input for all required fields from the User schema
  if (!name || !email || !password || !role || !skills || !seniority || maxCapacity === undefined || !department) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, password, role, skills, seniority, maxCapacity, department) are required",
    });
  }

  // Basic validation for enum fields
  if (!['engineer', 'manager'].includes(role)) {
    return res.status(400).json({ success: false, message: "Role must be 'engineer' or 'manager'." });
  }
  if (!['junior', 'mid', 'senior'].includes(seniority)) {
    return res.status(400).json({ success: false, message: "Seniority must be 'junior', 'mid', or 'senior'." });
  }
  if (typeof maxCapacity !== 'number' || maxCapacity < 0) {
    return res.status(400).json({ success: false, message: "Max capacity must be a non-negative number." });
  }
  if (!Array.isArray(skills) || !skills.every(s => typeof s === 'string')) {
      return res.status(400).json({ success: false, message: "Skills must be an array of strings." });
  }


  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password and create a new user
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name, // Changed from userName
      email,
      password: hashPassword,
      role,
      skills,
      seniority,
      maxCapacity,
      department
    });

    // Save user to the database
    const user = await newUser.save();
    // console.log("New user registered:", user);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        seniority: user.seniority,
        maxCapacity: user.maxCapacity,
        department: user.department,
      },
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during registration",
      error: e.message // Include error message for debugging
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // Sign JWT token with user's ID, role, email, and name
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        name: checkUser.name, // Changed from userName
      },
      process.env.JWT_SECRET_KEY || "CLIENT_SECRET_KEY", // Use environment variable for secret key
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: checkUser._id,
        name: checkUser.name, // Changed from userName
        email: checkUser.email,
        role: checkUser.role,
        skills: checkUser.skills,
        seniority: checkUser.seniority,
        maxCapacity: checkUser.maxCapacity,
        department: checkUser.department,
        // Removed profilePic, address, designation, phoneNumber as they are not in the provided User schema
      },
    });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during login",
      error: e.message // Include error message for debugging
    });
  }
};

// Logout User
const logoutUser = (req, res) => {
  // In a token-based authentication system, clearing a cookie named 'token'
  // is common if the token is stored in a cookie.
  // If the token is only in local storage/session storage, this might not be strictly necessary
  // but it's good practice for consistency.
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  // Use req.headers.authorization for Bearer token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing. Unauthorized User!",
    });
  }

  try {
    // Verify the token using jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "CLIENT_SECRET_KEY"); // Use environment variable
    req.user = decoded; // Attach decoded user data to the request (id, role, email, name)
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token verification fails (e.g., token expired, invalid signature)
    console.error("JWT verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Unauthorized User!",
      error: error.message
    });
  }
};

// Removed updateProfile and additionalDetails as they are not supported by the current User schema.
// If you need these functionalities, you must first update your User schema to include:
// - profilePic: String
// - address: String
// - designation: String
// - phoneNumber: String

// Get User Profile (authenticated user)
const getUser = async (req, res) => {
  try {
    // Extract userId from req.user (set by authMiddleware)
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing from token. Authentication might be invalid.",
      });
    }

    // Fetch user details from the database
    // Select only the fields defined in your User schema
    const user = await User.findById(userId).select(
      "name email role skills seniority maxCapacity department" // Changed userName to name, removed non-schema fields
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  getUser,
};
