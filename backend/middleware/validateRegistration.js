// Validate and normalise registration input before it reaches the controller.
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required."
        });
    }

    const normalisedName = name.trim();
    const normalisedEmail = email.trim().toLowerCase();

    if (normalisedName.length < 2 || normalisedName.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 2 and 100 characters."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalisedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Store only validated and normalised values for the controller.
    req.validatedRegistration = {
        name: normalisedName,
        email: normalisedEmail,
        password
    };

    next();
};

module.exports = validateRegistration;