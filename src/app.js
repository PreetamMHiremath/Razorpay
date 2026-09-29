const express=require("express");
const app=express();
const cors=require("cors");
const path=require("path");
const paymentRouter = require("./routes/payments.routes");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"../public")));
app.use("/api",paymentRouter);


module.exports=app;