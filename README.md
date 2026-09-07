# 🚀 HustleHub+

## 📘 INFORMATION SYSTEMS 3D — INSY7314
### Portfolio of Evidence (POE) — Part 1

---

## 👥 Team Information

**Team Name:** NextGen CodeCrafters

### 👨‍💻 Development Team

- Keona Mackan (ST10445050)
- Teah Andrew (ST10440926)
- Ethan Govender (ST10250993)
- Kiara Israel (ST10277747)

## 📌 System Overview

HustleHub+ is a secure, role-based freelance marketplace designed to connect clients with freelancers offering different professional services.

Clients will eventually be able to browse and book freelance services, while freelancers will be able to provide and manage their services. Administrators will be responsible for higher-level management and monitoring of the platform.

Part 1 focuses specifically on developing the secure backend foundation of HustleHub+. The backend currently supports user registration, secure login, password hashing, JWT authentication, protected API routes, input validation, secure error handling, MongoDB storage and HTTPS communication.

## 👤 Intended Users

HustleHub+ is designed for three main user types:

- **Clients** — users who browse and book freelance services.
- **Freelancers** — users who provide and manage freelance services.
- **Administrators** — users who will manage and monitor the platform.

For Part 1, public registration allows users to register as either a **client** or **freelancer**. Users cannot register themselves as administrators for security reasons.

## 📁 Backend Structure

```text
backend/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── authenticateToken.js
│   ├── errorHandler.js
│   └── validateAuth.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── utils/
│   └── generateToken.js
├── app.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 📁 Backend Components

The HustleHub+ backend is organised into separate components so that each file has a clear responsibility.

| 📄 Component | 🛠️ Responsibility |
|---|---|
| `config/database.js` | Connects the backend to MongoDB using Mongoose. |
| `controllers/authController.js` | Handles user registration, login, password hashing, password verification and JWT generation. |
| `middleware/validateAuth.js` | Validates, cleans and normalises registration and login requests before they are processed. |
| `middleware/authenticateToken.js` | Verifies JWT authentication tokens before users can access protected API routes. |
| `middleware/errorHandler.js` | Handles application errors securely without exposing sensitive internal information. |
| `models/User.js` | Defines the structure and validation rules for user information stored in MongoDB. |
| `routes/authRoutes.js` | Defines authentication endpoints and connects routes to the required middleware and controllers. |
| `utils/generateToken.js` | Generates signed JSON Web Tokens for authenticated users. |
| `app.js` | Configures the Express application, middleware, routes, 404 handling and central error handling. |
| `server.js` | Connects to MongoDB and starts the HustleHub+ API securely over HTTPS. |

This modular structure improves maintainability and keeps routing, authentication, validation, database access and error handling clearly separated.

## 🛡️ Security Decisions

The following security decisions were made for HustleHub+ Part 1:

- **bcrypt** is used so passwords are never stored in plain text.
- **JWT authentication** is used to identify authenticated users and protect API routes.
- **Input validation** prevents invalid and malicious values from being processed.
- **Secure error handling** prevents internal system details from being exposed.
- **HTTPS** encrypts credentials and authentication tokens during communication.
- **Environment variables** are used to keep sensitive configuration values out of the source code.

## 🔒 Password Hashing

HustleHub+ never stores user passwords in plain text.

Passwords are securely hashed using **bcrypt** before user information is stored in MongoDB.

During registration:

```text
Plain-Text Password
        ↓
bcrypt.hash()
        ↓
Secure Password Hash
        ↓
MongoDB
```

During login, the password supplied by the user is compared with the stored hash using:

```javascript
bcrypt.compare()
```

This allows the backend to verify passwords without storing the original password.

The `passwordHash` field is also excluded from normal database queries using:

```javascript
select: false
```

This reduces unnecessary exposure of password hashes.
## 🎟️ Token-Based Authentication

HustleHub+ uses **JSON Web Tokens (JWT)** to identify authenticated users.

After successful login, the API generates a signed JWT containing:

- User ID
- Email
- Role

Passwords and password hashes are never included in the token.

Protected requests must include:

```text
Authorization: Bearer <JWT>
```

The authentication middleware checks that:

- A token is supplied
- The Bearer format is correct
- The JWT is valid
- The JWT has not expired

Requests with missing, invalid or expired tokens are rejected.

This ensures that JWTs are not only generated during login but are actively used to protect API routes.

## ✅ Input Validation

All authentication input is validated before it is processed.

Registration validation checks:

- Required fields
- Correct data types
- Name length
- Valid email format
- Password length
- Password strength
- Valid registration role
- Unsupported fields
- Malicious object input

Emails are trimmed and converted to lowercase before processing.

Passwords must:

- Be between 8 and 128 characters
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number
- Contain at least one special character

Only **client** and **freelancer** roles are accepted through public registration.

This prevents invalid or unsafe values from reaching the authentication logic or database.

## ⚠️ Secure Error Handling

HustleHub+ uses centralised error handling to ensure that API errors are returned safely.

The API does not expose:

- Stack traces
- File paths
- Environment variables
- MongoDB connection details
- JWT secrets
- Configuration values

Unexpected errors return a controlled response such as:

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

This prevents sensitive technical information from being exposed to users.

## 🔐 HTTPS / SSL

HustleHub+ is served over HTTPS using a locally configured SSL certificate.

The backend runs at:

```text
https://localhost:3000
```

HTTPS is important because it encrypts communication between the API client and backend.

This helps protect sensitive information such as:

- Passwords
- Email addresses
- JWT authentication tokens

Without HTTPS, sensitive information could potentially be intercepted while travelling between the client and server.

The SSL certificate and private key remain local and are excluded from GitHub using `.gitignore`.

## 🌍 Environment Variables

Sensitive configuration values are stored inside the `.env` file instead of being hard-coded into the source code.

These include:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
BCRYPT_ROUNDS
HTTPS_PORT
SSL_KEY_PATH
SSL_CERT_PATH
```

The `.env` file is excluded from GitHub using `.gitignore`.

A `.env.example` file is included to show which configuration values are required without exposing private credentials.

## ▶️ Running the Backend

Install the required dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a guide.

Start the development server:

```bash
npm run dev
```

A successful startup should display:

```text
MongoDB connection successful
HustleHub+ API is running securely on https://localhost:3000
```

## 🎥 Demo Video

A demonstration of the application can be viewed on YouTube using the link below:

[▶️ Watch the Demo Video](https://youtu.be/IL6yVHtg6z0)

## 🏁 Conclusion

HustleHub+ Part 1 establishes the secure backend foundation of the freelance marketplace.

The backend includes secure user registration and login, bcrypt password hashing, JWT authentication, protected API routes, input validation, secure error handling, MongoDB storage and HTTPS communication.

These security measures help protect user information while providing a structured and maintainable foundation for later HustleHub+ development.
