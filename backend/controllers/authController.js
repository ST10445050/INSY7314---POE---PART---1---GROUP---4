const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// Register a new HustleHub+ user.
const registerUser = async (req, res, next) => {
    try {
        // Read only the cleaned values produced by validation middleware.
        const { name, email, password, role } =
            req.validatedRegistration;

        // Check whether an account already exists for this email address.
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Read the bcrypt work factor from the private environment configuration.
        const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

        if (!bcryptRounds) {
            throw new Error("BCRYPT_ROUNDS is not configured.");
        }

        // Hash the password before any user record is stored.
        const passwordHash = await bcrypt.hash(
            password,
            bcryptRounds
        );

        // Create the user using only validated registration information.
        const user = await User.create({
            name,
            email,
            passwordHash,
            role
        });

        // Generate a signed JWT after successful account creation.
        const token = generateToken(user);

        // Return only authentication information and safe user details.
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // Pass unexpected errors to the central error handler.
        next(error);
    }
};


// Log in an existing HustleHub+ user.
const loginUser = async (req, res, next) => {
    try {
        // Read only the cleaned login values from validation middleware.
        const { email, password } = req.validatedLogin;

        // Password hashes are excluded normally, so login requests it explicitly.
        const user = await User.findOne({ email })
            .select("+passwordHash");

        // Use a generic response so the API does not reveal registered emails.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Safely compare the entered password with the stored bcrypt hash.
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        // Use the same message for an incorrect password.
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Issue a new signed token after successful authentication.
        const token = generateToken(user);

        // Return only the token and non-sensitive user information.
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // Pass unexpected errors to the central error handler.
        next(error);
    }
};


// Export authentication controllers for use by authRoutes.js.
module.exports = {
    registerUser,
    loginUser
};