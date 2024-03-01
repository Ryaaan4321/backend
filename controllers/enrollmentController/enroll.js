// Import necessary modules and configurations
const config = require('../../config/mainConfig.js');
const Users = require('../../models/user.js');
const Enroll = require('../../models/enrollment.js');

// Define a module with various functions related to enrollment
const moduleExport = {

    // Function to handle enrollment form submission
    async enrollForm(req, res) {
        try {
            // Extract data from the request body
            const { id, payNow, batch, enrollDate } = req.body;

            // Define an array of month names for reference
            const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            // Get the month name from the enrollment date
            const d = new Date(enrollDate);
            let monthName = Months[d.getMonth()];

            // Find the user by ID in the database
            let user = await Users.findById(id);

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ message: "User does not exist" });
            }

            // Check if the user's age is within the acceptable range
            if (user.Age < 18 || user.Age > 65) {
                return res.status(400).json({ message: 'Age not applicable' });
            }

            // Check if the user is already enrolled for the selected month
            let checkEnrollment = await Enroll.findOne({ author: id, month: monthName });

            if (checkEnrollment) {
                return res.status(400).json({ message: `Already enrolled for month ${monthName}` });
            }

            // Initialize payment-related variables
            let paymentId = null, paymentStatus = 0, paymentDate = null;

            // Process payment if 'payNow' is true
            if (payNow) {
                paymentStatus = 1;
                paymentId = '123SBSB';
                paymentDate = new Date();
            }

            // Create a new enrollment record in the database
            const result = await Enroll.create({
                author: id,
                payNow: payNow,
                paymentStatus: paymentStatus,
                paymentId: paymentId,
                paymentDate: paymentDate,
                enrollDate: enrollDate,
                month: monthName,
                batch: batch
            });

            // Respond with success message and enrollment details
            return res.status(201).json({ message: "Enrolled Successfully", res: result });
        } catch (err) {
            // Handle errors and respond with an error message
            res.status(500).json({ message: "Something went wrong", Error: err });
        }
    },

    // Function to handle payment at a later date
    async payLater(req, res) {
        try {
            // Extract data from the request body
            const { enrollID, payNow, paymentDate } = req.body;

            // Find the enrollment record by ID in the database
            let checkEnroll = await Enroll.findById(enrollID);

            // Check if the enrollment record exists
            if (!checkEnroll) {
                return res.status(400).json({ message: "Invalid Enroll ID" });
            }

            // Initialize payment-related variables
            let paymentID, paymentStatus;

            // Process payment if 'payNow' is true
            if (payNow) {
                paymentStatus = 1;
                paymentID = "123SBSB";
            }

            // Update payment details in the enrollment record
            checkEnroll.paymentStatus = paymentStatus;
            checkEnroll.paymentID = paymentID;
            checkEnroll.paymentDate = paymentDate;

            // Save the updated enrollment record
            checkEnroll = await checkEnroll.save();

            // Respond with success message and updated enrollment details
            return res.status(200).json({ message: "Paid Successfully", res: checkEnroll });
        } catch (err) {
            // Handle errors and respond with an error message
            res.status(500).json({ message: "Something went wrong", Error: err });
        }
    },

    // Function to retrieve all enrollments for a specific user
    async getAllEnrollments(req, res) {
        try {
            // Extract user ID from the request parameters
            const { userID } = req.params;

            // Find all enrollment records for the specified user ID
            let enrollments = await Enroll.find({ author: userID });

            // Find the user by ID in the database
            let user = await Users.findById(userID);

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ message: "User doesn't exist" });
            }

            // Respond with success message and the list of enrollments
            return res.status(200).json({ message: "Success", res: enrollments });
        } catch (err) {
            // Handle errors and respond with an error message
            res.status(500).json({ message: "Something went wrong", Error: err });
        }
    }
};

// Export the module for use in other parts of the application
module.exports = moduleExport;
