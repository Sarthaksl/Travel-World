import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const errorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

const verifyToken = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return errorHandler(res, 401, 'No token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use the correct property based on how the token was signed
    const userId = decoded.userId; // Ensure this matches what is used when signing the token

    // Fetch the user from the database using the userId
    const user = await User.findById(userId);
    if (!user) {
      return errorHandler(res, 401, 'Invalid token');
    }

    req.user = user; // Attach user to request for future middleware
    next(); // Continue to the next middleware
  } catch (error) {
    console.error('Token verification error:', error);
    return errorHandler(res, 401, 'Invalid token');
  }
};

// Verify if the user role is 'user'
export const verifyUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next(); // User has access
  } else {
    return errorHandler(res, 403, 'Access denied');
  }
};

// Verify if the user role is 'admin'
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin has access
  } else {
    return errorHandler(res, 403, 'Access denied');
  }
};

export default verifyToken;
