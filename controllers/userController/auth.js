import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import config from '../../config/mainConfig'
import Users  from '../../models/user.js'


const secret = config.jwtSecretKey;
const expiresIn = config.jwtExpireToken;

const moduleExport = {

    /**
     * Handles user sign-in.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - User details and JWT token.
     */
    async signin(req, res) {
        const { email, password } = req.body;

        try {
            // Check if the user with the given email exists
            const userExists = await Users.findOne({ email: email });

            if (!userExists) {
                return res.status(404).json({ message: `User with this email: ${email} does not exist` });
            }

            // Compare the provided password with the hashed password stored in the database
            const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Generate a JWT token for authentication
            const token = jwt.sign({ email: userExists.email, id: userExists._id }, secret, { expiresIn: expiresIn });

            // Respond with user details and token
            res.status(200).json({ result: userExists, token });
        } catch (err) {
            // Handle errors and respond with a generic error message
            res.status(500).json({ message: "Something went wrong" });
        }
    },

    /**
     * Handles user sign-up.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - User details and JWT token.
     */
    async signup(req, res) {
        const { email, password } = req.body;

        try {
            // Check if the user with the given email already exists
            const userExists = await Users.findOne({ email: email });

            if (userExists) {
                return res.status(400).json({ message: `User with this email: ${email} already exists` });
            }

            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create a new user record in the database
            const result = await Users.create({ email: email, password: hashedPassword });

            // Generate a JWT token for authentication
            const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: expiresIn });

            // Respond with user details and token
            res.status(201).json({ result, token });
        } catch (error) {
            // Handle errors and respond with an error message
            res.status(500).json({ message: "Something went wrong", error: error });
        }
    },

    /**
     * Resets user password.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - Success message.
     */
    async resetpassword(req, res) {
        try {
            const { id, password } = req.body;

            // Find the user by ID in the database
            let user = await Users.findById(id);

            if (!user)
                return res.status(404).json({ message: "User doesn't exist" });

            // Hash the new password and update the user's password
            const hashedPassword = await bcrypt.hash(password, 12);
            user.password = hashedPassword;
            user = await user.save();

            // Respond with a success message
            return res.status(200).json({ message: "Password Reset Successful" });
        } catch (error) {
            // Handle errors and respond with an error message
            return res.status(500).json({ message: "Something went wrong...", error: error });
        }
    },

    /**
     * Updates user profile.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - Success message.
     */
    async updateprofile(req, res) {
        try {
            const { name, phone, DOB, age, id } = req.body;

            // Find the user by ID in the database
            let user = await Users.findById(id);

            if (!user)
                return res.status(404).json({ message: "User doesn't exist" });

            // Update user profile details
            user.name = name;
            user.phone = phone;
            user.DOB = DOB;
            user.Age = age;

            user = await user.save();

            // Respond with a success message
            return res.status(200).json({ message: "Profile Update Successful" });
        } catch (error) {
            // Handle errors and respond with an error message
            return res.status(500).json({ message: "Something went wrong...", error: error });
        }
    },

    /**
     * Retrieves user profile.
     * 
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} - User details.
     */
    async getprofile(req, res) {
        try {
            const { id } = req.body;

            // Find the user by ID in the database
            let user = await Users.findById(id);

            if (!user)
                return res.status(404).json({ message: "User doesn't exist" });

            // Respond with user details
            return res.status(200).json({ message: "Get Profile", res: user });
        } catch (error) {
            // Handle errors and respond with an error message
            return res.status(500).json({ message: "Something went wrong...", error: error });
        }
    },
}

export default moduleExport;
