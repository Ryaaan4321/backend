const express= require("express");
const router = express.Router();

const AuthController = require('../../controllers/user/index.js');
const AuthMiddleware=require('../../middleware/auth.js');

router.post('/signup',AuthController.signup)

router.post('/resetpassword',AuthMiddleware,AuthController.resetpassword)

router.post('/updateProfile',AuthMiddleware,AuthController.updateProfile);


router.post('/getProfile',AuthMiddleware,AuthController.getProfile);

export default router;