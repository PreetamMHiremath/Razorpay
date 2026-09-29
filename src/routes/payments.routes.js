const express=require("express");
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const paymentRouter=express.Router();

paymentRouter.post("/createOrder",createOrder);
paymentRouter.post("/verifyPayment",verifyPayment);
paymentRouter.get("/config",(req,res)=>{
	res.json({keyId:process.env.RAZORPAY_KEY_ID});
});

module.exports=paymentRouter;