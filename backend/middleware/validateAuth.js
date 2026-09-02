// Validate and clean user registration requests before they reach the controller.
const validateRegistration = (req, res, next) => {
    const body = req.body;

    // Reject requests that do not contain a JSON body.
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Registration details are required."
        });
    }

    const { name, email, password, role } = body;

    // Ensure the main registration fields contain text values.
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof role !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, email, password and role must contain text values."
        });
    }

    // Remove unnecessary spaces and normalise values used for validation.
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedRole = role.trim().toLowerCase();

    // Reject empty values after surrounding spaces have been removed.
    if (!cleanedName || !cleanedEmail || !password || !cleanedRole) {
        return res.status(400).json({
            success: false,
            message: "Name, email, password and role are required."
        });
    }

    // Keep names within the same limits enforced by the User model.
    if (cleanedName.length < 2 || cleanedName.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 2 and 100 characters."
        });
    }

    // Validate the general structure of the email address.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Restrict passwords to the permitted length range.
    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({
            success: false,
            message: "Password must be between 8 and 128 characters."
        });
    }

    // Check each part of the password complexity policy.
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    // Reject passwords that do not satisfy all required security rules.
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

    // Public registration may create clients or freelancers only.
    const allowedRegistrationRoles = ["client", "freelancer"];

    if (!allowedRegistrationRoles.includes(cleanedRole)) {
        return res.status(400).json({
            success: false,
            message: "Role must be either client or freelancer."
        });
    }

    // Store only cleaned and validated values for the registration controller.
    req.validatedRegistration = {
        name: cleanedName,
        email: cleanedEmail,
        password,
        role: cleanedRole
    };

    // Continue to the registration controller.
    next();
};


// Validate and clean login requests before they reach the controller.
const validateLogin = (req, res, next) => {
    const body = req.body;

    // Reject requests that do not contain login information.
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Login details are required."
        });
    }

    const { email, password } = body;

    // Ensure the login fields contain text values.
    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password must contain text values."
        });
    }

    // Normalise the email so database lookups are consistent.
    const cleanedEmail = email.trim().toLowerCase();

    // Reject empty credentials after the email has been cleaned.
    if (!cleanedEmail || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    // Validate the general structure of the email address.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanedEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Store cleaned credentials for the login controller.
    req.validatedLogin = {
        email: cleanedEmail,
        password
    };

    // Continue to the login controller.
    next();
};


// Export both authentication validation functions for use in auth routes.
module.exports = {
    validateRegistration,
    validateLogin
};