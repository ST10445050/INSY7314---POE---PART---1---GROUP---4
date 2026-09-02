const mongoose = require("mongoose");

// Define the structure and validation rules for user documents.
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["client", "freelancer", "admin"],
            default: "client"
        }
    },
    {
        timestamps: true
    }
);

// Export the User model for use in authentication controllers.
module.exports = mongoose.model("User", userSchema);