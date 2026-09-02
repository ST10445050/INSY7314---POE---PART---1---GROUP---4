// Validate and clean user registration requests.
const validateRegistration = (req, res, next) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Registration details are required."
        });
    }

    const { name, email, password } = body;

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password must contain text values."
        });
    }

    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedName || !cleanedEmail || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required."
        });
    }

    if (cleanedName.length < 2 || cleanedName.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 2 and 100 characters."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({
            success: false,
            message: "Password must be between 8 and 128 characters."
        });
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    if (
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecialCharacter
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
        });
    }

    // Store validated registration data for the controller.
    req.validatedRegistration = {
        name: cleanedName,
        email: cleanedEmail,
        password,
        role: "client"
    };

    next();
};

// Validate and clean user login requests.
const validateLogin = (req, res, next) => {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Login details are required."
        });
    }

    const { email, password } = body;

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password must contain text values."
        });
    }

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Store validated login data for the controller.
    req.validatedLogin = {
        email: cleanedEmail,
        password
    };

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};