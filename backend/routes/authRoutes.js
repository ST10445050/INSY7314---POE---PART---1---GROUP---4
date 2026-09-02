const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const {
    validateRegistration,
    validateLogin
} = require("../middleware/validateAuth");

const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Register a new HustleHub+ user.
router.post(
    "/register",
    validateRegistration,
    registerUser
);

// Log in an existing HustleHub+ user.
router.post(
    "/login",
    validateLogin,
    loginUser
);

// Protected profile route.
router.get(
    "/profile",
    authenticateToken,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Authenticated profile access granted.",
            user: req.user
        });
    }
);

module.exports = router;