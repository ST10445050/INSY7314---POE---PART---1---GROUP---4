// Load environment variables before accessing configuration values.
require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("./app");
const connectDatabase = require("./config/database");


// Read HTTPS configuration from environment variables.
const HTTPS_PORT = process.env.HTTPS_PORT || 3000;

const sslKeyPath =
    process.env.SSL_KEY_PATH ||
    "certificates/privatekey.pem";

const sslCertPath =
    process.env.SSL_CERT_PATH ||
    "certificates/certificate.pem";


// Resolve certificate paths relative to this backend folder.
// This allows the server to locate the files reliably.
const resolvedKeyPath = path.resolve(
    __dirname,
    sslKeyPath
);

const resolvedCertPath = path.resolve(
    __dirname,
    sslCertPath
);


// Read the private key and certificate required for HTTPS.
const httpsOptions = {
    key: fs.readFileSync(resolvedKeyPath),
    cert: fs.readFileSync(resolvedCertPath)
};


// Connect to MongoDB before starting the secure API server.
const startServer = async () => {
    try {
        await connectDatabase();

        // Start the Express application using HTTPS instead of HTTP.
        https
            .createServer(httpsOptions, app)
            .listen(HTTPS_PORT, () => {
                console.log(
                    `HustleHub+ API is running securely on https://localhost:${HTTPS_PORT}`
                );
            });

    } catch (error) {
        // Keep startup errors on the server without exposing configuration values.
        console.error(
            "Application startup failed:",
            error.message
        );

        process.exit(1);
    }
};


startServer();