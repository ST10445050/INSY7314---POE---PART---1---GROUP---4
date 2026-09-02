const mongoose = require("mongoose");

// Connect the application to MongoDB using the environment configuration.
const connectDatabase = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is not configured.");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connection successful");
};

module.exports = connectDatabase;