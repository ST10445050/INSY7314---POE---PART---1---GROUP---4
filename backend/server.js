// Load environment variables from the .env file.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

const app = express();

// Allow the API to receive JSON request bodies.
app.use(express.json());

// Allow requests from the frontend during development.
app.use(cors());

// Basic route used to confirm that the API is running.
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

const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the API server.
const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`HustleHub+ API is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Application startup failed:", error.message);
        process.exit(1);
    }
};

startServer();