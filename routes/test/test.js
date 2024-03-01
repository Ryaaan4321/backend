const express = require('express');

const router=express.Router();

const TestController = require('../../controllers/test/index.js');

router.get('/test',TestController.test);

export default router;