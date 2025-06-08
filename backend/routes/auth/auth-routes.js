const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateProfile,
  additionalDetails,
  getUser,
} = require("../../controllers/auth/auth-controller");
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage });
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", authMiddleware, getUser);
// Protect the route with authMiddleware and handle file upload
// router.put(
//   "/update-profile",
//   authMiddleware,
//   upload.single("profilePicture"),
//   updateProfile
// );
// router.put("/additionalDetails/:id", additionalDetails);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user ",
    user,
  });
});

module.exports = router;
