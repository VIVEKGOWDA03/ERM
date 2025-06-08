// Make sure you import dotenv at the very top of the file
// if this middleware is in a separate file and not in server.js
require('dotenv').config(); // Add this if not already in server.js or the file requiring this middleware

const jwt = require('jsonwebtoken'); // Ensure jwt is imported

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // console.log("Auth Middleware: Received token:", token); // Good for debugging

  if (!token) {
    // console.log("Auth Middleware: No token provided."); // Good for debugging
    return res.status(401).json({
      success: false,
      message: "Unauthorized User!",
    });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- CORRECTED LINE
    req.user = decoded; // Attach user data to the request (e.g., { id: '...', role: '...' })
    // console.log("Auth Middleware: Token decoded successfully:", decoded); // Good for debugging
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token verification fails (e.g., expired, invalid signature)
    console.error("Auth Middleware Error:", error.name, error.message); // Crucial for debugging specific JWT errors
    let errorMessage = "Unauthorized User!";
    if (error.name === 'TokenExpiredError') {
      errorMessage = "Unauthorized User! (Token expired)";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Unauthorized User! (Invalid token)";
    }

    res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = { authMiddleware };