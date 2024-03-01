const express = require("express");

const router = express.Router();


const enroll=require('./enroll.js');

router.use('/',enroll);

export default router;