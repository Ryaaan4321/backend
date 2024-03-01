import jwt from "jsonwebtoken";
import config from '../config/mainConfig.js';
import User from '../models/user.js';

const secret = config.jwtSecretKey;
const expiresIn = config.jwtExpireToken;

/**
 * Middleware to check the validity of user tokens for authorization.
 * If the token is valid, the request is allowed to proceed; otherwise, access is denied.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to pass control to the next middleware.
 */
const auth = async (req, res, next) => {
    // Extract the token from the Authorization header
    const bearerHeader = req.headers["authorization"];

    // If no token is provided, deny access
    if (!bearerHeader) {
        return res.status(401).json({
            status: false,
            message: "Access denied. No token provided."
        });
    }

    const token = bearerHeader.split(" ")[1];

    // If no token is found, deny access
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Access denied. No token provided."
        });
    }

    try {
        // Determine whether the token is from custom authentication or Google authentication
        const isCustomAuth = token.length < 500;

        let decodedData; // Data to be extracted from the token

        // Decode and verify the token
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, secret);
            req.userId = decodedData ?.id;

            // Check if the token has expired
            checkTokenExpiry(req.userId, token, res);
        } else {
            // For Google authentication
            decodedData = jwt.decode(token);
            // 'sub' is the user's ID in Google authentication
            req.userId = decodedData ?.sub;
        }

        // Allow the request to proceed to the next middleware
        next();
    } catch (error) {
        // Handle errors and send an error response
        res.send(error);
        console.log('Error', error);
    }
}

/**
 * Checks if the token has expired.
 * @param {string} userId - User ID extracted from the token.
 * @param {string} token - User token to be checked for expiry.
 * @param {Object} res - Express response object.
 */
const checkTokenExpiry = async (userId, token, res) => {
    // Find the user in the database using the user ID and token
    const user = await User.findOne({ _id: userId, token: token });

    // If the user is not found, deny access due to token expiration
    if (!user) {
        return res.status(401).json({
            status: false,
            message: "Token expired"
        });
    }
}

export default auth;
