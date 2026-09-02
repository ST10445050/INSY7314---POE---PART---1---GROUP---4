// Handle unexpected application errors in one secure location.
const errorHandler = (error, req, res, next) => {
    // Handle MongoDB duplicate-key errors safely.
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with the supplied information already exists."
        });
    }

    // Handle validation errors produced by Mongoose schemas.
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "The supplied information is invalid."
        });
    }

    // Handle malformed MongoDB object identifiers safely.
    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "The supplied identifier is invalid."
        });
    }

    // Log the error internally during development without exposing it to the client.
    console.error("Application error:", error.message);

    // Return a controlled response without stack traces, file paths or secrets.
    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later."
    });
};

module.exports = errorHandler;