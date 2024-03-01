const express = require("express");
const router=express.Router();

router.post('/enroll',authMiddleware,enrollController.enrollForm);

router.post('/enroll/paylater',authMiddleware,enrollController.payLater);


router.post('/enroll/getAll',authMiddleware,enrollController.getAllEnrollments);

export default router;