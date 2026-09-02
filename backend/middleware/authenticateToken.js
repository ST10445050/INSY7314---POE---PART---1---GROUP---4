const jwt = require("jsonwebtoken");

// Verify JWTs before allowing access to protected routes.
const authenticateToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is required."
        });
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Authorization header must use the Bearer token format."
        });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({
            success: false,
            message: "Authentication configuration is unavailable."
        });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret, {
            algorithms: ["HS256"],
            issuer: "HustleHub+",
            audience: "HustleHub+ users"
        });

        req.user = decodedToken;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token has expired."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication token is invalid."
        });
    }
};

module.exports = authenticateToken;