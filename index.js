const express =require( 'express');
const cors = require('cors');
const mongoose =require('mongoose');
const dotenv=require('dotenv');

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({limit:'30mb' , extended:true}));

app.use(cors());

app.get('/' , (req , res)=>{
    res.send("Evrything is fine we can move ahead");
    mongoose.connect(MONGO_URL)
    .then(()=>app.listen(5000,()=>console.log(`Backend is running on port ${5000}`)))
    .catch((err)=>console.log(err))
})