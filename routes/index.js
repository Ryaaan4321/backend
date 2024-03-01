const express = require('express');

const UserAuthRoutes= require('./user/index.js');
const EnrollRoutes=require('./enrollment/index.js');
const TestRoutes=require('./test/index.js');

const router=express.Router();

router.use('/user',UserAuthRoutes);
router.use('/user',EnrollRoutes);
router.use('/',TestRoutes);

export default router;