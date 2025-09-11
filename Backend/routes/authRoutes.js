// import express from "express";
// import { register, login } from "../controllers/authController.js";
// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Authentication
//  *   description: User authentication endpoints
//  */

// /**
//     @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Authentication]
//  *     description: Creates a new user account with name, email, and password.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "John Doe"
//  *               email:
//  *                 type: string
//  *                 example: "johndoe@example.com"
//  *               password:
//  *                 type: string
//  *                 example: "securepassword123"
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *       400:
//  *         description: Email already in use or validation error
//  */
// router.post("/register", register);

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: Log in a user
//  *     tags: [Authentication]
//  *     description: Authenticates a user and returns a JWT token.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: "johndoe@example.com"
//  *               password:
//  *                 type: string
//  *                 example: "securepassword123"
//  *     responses:
//  *       200:
//  *         description: Login successful, returns JWT token
//  *       400:
//  *         description: Invalid credentials
//  */
// router.post("/login", login);

// /**
//  * @swagger
//  * /auth/socket:
//  *   get:
//  *     summary: Real-time authentication via WebSockets (Socket.io)
//  *     tags: [Authentication]
//  *     description: "Handles real-time authentication for user login and registration via WebSockets."
//  *     responses:
//  *       101:
//  *         description: WebSocket connection established
//  *       400:
//  *         description: WebSocket connection error
//  */

// export default router;


import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints (with branch integration)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account.  
 *       If the branch does not exist, a new branch will be created during registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *               role:
 *                 type: string
 *                 example: "Doctor"
 *               branchId:
 *                 type: string
 *                 description: Existing branch ID (if you want to link user to an existing branch).
 *                 example: "64f94b24e9d8a5c123456789"
 *               branchName:
 *                 type: string
 *                 description: Branch name (only required if creating a new branch).
 *                 example: "Lagos"
 *               branchLocation:
 *                 type: string
 *                 description: Optional location for the branch.
 *                 example: "Ikeja"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token containing user details (id, name, role, branchId).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token with user details
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

export default router;
