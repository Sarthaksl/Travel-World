import express from 'express';
import cors from 'cors';
import { registerUser, loginUser } from "../controllers/authController.js";

const authRoute = express.Router();

// Apply CORS middleware with wide-open settings (for development only)
authRoute.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allows cookies to be sent along with requests
}));

// Register a new user
authRoute.post('/register', (req, res) => {
    // Set the response headers
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Call the registerUser function
    registerUser(req, res);
});

// Login user
authRoute.post('/login', (req, res) => {
    // Call the loginUser function
    // Set the response headers
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    loginUser(req, res);
});

export default authRoute;
