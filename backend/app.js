const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// Allow the API to receive and process JSON request bodies.
app.use(express.json());


// Allow permitted frontend applications to communicate with the API.
// This will be strengthened further when CORS security is configured.
app.use(cors());


// Confirm that the HustleHub+ API is available.
app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "HustleHub+ API is running"
    });
});


// Register all authentication-related endpoints.
app.use("/auth", authRoutes);



// Handle requests that do not match any valid API route.
// This must remain after all valid routes.
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found."
    });
});


// Handle unexpected errors securely.
// This must be the final middleware registered in the application.
app.use(errorHandler);


module.exports = app;