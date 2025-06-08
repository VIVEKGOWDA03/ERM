const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path"); 

const authRouter = require("./routes/auth/auth-routes");
const projectRouter = require("./routes/project/project-routes");
const assignmentRouter = require("./routes/assignment/assignment-routes");
const engineerRouter = require("./routes/engineer/engineer-routes");


const app = express();
const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.log("❌ MongoDB Connection Error:", error));

// ✅ CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's origin
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// ✅ Middleware Config
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Removed: Serve Static Files for uploads (as requested)
// app.use("/uploads", express.static(uploadDir));

// ✅ API Routes (define these BEFORE static serving fallback)
app.use("/api/auth", authRouter);
// NEW: Mount the dashboard data routes
app.use("/api/", projectRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/engineers", engineerRouter);


// ✅ Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  
  // Catch-all route to serve the frontend's index.html for any other request
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));
