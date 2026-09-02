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

// Log in an existing HustleHub+ user.
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.validatedLogin;

        // Retrieve the user and explicitly include the password hash.
        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare the entered password with the stored password hash.
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate a new JWT after successful login.
        const token = generateToken(user);

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
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser
};