const app=require("./src/app.js");

app.listen(process.env.PORT || 8015,()=>{
    console.log("Server started successfully.");
});
