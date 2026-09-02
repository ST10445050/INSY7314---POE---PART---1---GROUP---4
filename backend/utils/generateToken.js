const jwt = require("jsonwebtoken");

// Generate a signed JWT for an authenticated HustleHub+ user.
const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured.");
    }

    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
    };

    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn,
        issuer: "HustleHub+",
        audience: "HustleHub+ users",
        algorithm: "HS256"
    });
};

module.exports = generateToken;