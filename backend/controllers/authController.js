const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register a new HustleHub+ user.
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.validatedRegistration;

        // Check whether an account already exists for this email.
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

        if (!bcryptRounds) {
            throw new Error("BCRYPT_ROUNDS is not configured.");
        }

        // Hash the password before storing the user.
        const passwordHash = await bcrypt.hash(password, bcryptRounds);

        // Public registration creates a normal client account by default.
        const user = await User.create({
            name,
            email,
            passwordHash,
            role: "client"
        });

        // Generate a JWT after successful registration.
        const token = generateToken(user);

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
        next(error);
    }
};

module.exports = {
    registerUser
};