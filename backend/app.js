const express = require("express");
const cors = require("cors");

const app = express();

// Allow the API to receive JSON request bodies.
app.use(express.json());

// Allow requests from the frontend during development.
app.use(cors());

// Confirm that the API is available.
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HustleHub+ API is running"
    });
});

// Handle requests made to routes that do not exist.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;