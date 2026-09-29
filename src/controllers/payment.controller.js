const createRazorpayInstance = require("../config/razorpay.config");
const crypto=require("crypto")
const razorpayInstance=createRazorpayInstance()
const createOrder= async(req,res)=>{
    // Here The main thing is we can't accept the amount from frontend
    const {courseId,amount}=req.body;
    const options={
        amount:amount*100,
        currency:"INR",
        receipt:`receipt_order_1`
    }

    try {
        razorpayInstance.orders.create(options,(err,order)=>{
            if(err){
                return res.status(500).json({
                    message:"Something went wrong",
                    success:false
                })
            };
            return res.status(200).json({
                order
            })
        })
    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong",
            success:false
        })
    }
}

const verifyPayment=async(req,res)=>{
    const {order_id,payment_id,signature}=req.body;
    const secret=process.env.RAZORPAY_KEY_SECRET;
    const hmac=crypto.createHmac("sha256",secret);
    const generatedSignature=hmac.update(`${order_id}|${payment_id}`).digest("hex");
    if (generatedSignature === signature) {
          return res.status(200).json({
                success: true,
                message: "Payment verified",
    });
    } 
    else {
  return res.status(400).json({
    success: false,
    message: "Payment not verified",
  });
}
}
module.exports={createOrder,verifyPayment};