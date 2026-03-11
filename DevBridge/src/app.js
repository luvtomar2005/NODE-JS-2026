/* Connecting our database */
const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/users');
const { validateSignUpData } = require('./utils/helper');
const bcrypt = require("bcrypt");
app.use(express.json()); // using express.json middleware
/* app.use(express.json()) is Express middleware used to parse incoming requests with 
JSON payloads. It converts the JSON data from the 
request body into a JavaScript object and makes it available in req.body. */


// creating signup api to adding data to database
app.post("/signup" ,  async (req , res) => {
    // validation of data
    try{

    validateSignUpData(req);
     ;

    // Encrypt the password
   
    const { firstName, lastName, emailId, passWord } = req.body
    const passWordHash = await bcrypt.hash(passWord , 10);
    console.log(passWordHash);
    // creating a document instance using the model.
    const user = new User({
        firstName,
        lastName,
        emailId,
        passWord : passWordHash
    });
    
    
        await user.save();
        res.send("User added successfully");

    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})

// Get user by email api
app.get("/user" , async (req , res) => {
    const  userEmail = req.body.emailId;
   
    try{
       const user =  await User.find({emailId : userEmail});
       if(user.length === 0){
            res.status(404).send("Something went wrong!!");
       }
       else{
        res.send(user);
       }
       
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

// Get api -> for feed creation -> GET /feed -> get all users from database
app.get("/feed" , async(req , res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
})

// Delete api -> for deleting the user...
app.delete("/user" ,async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
})

// Api for user login
app.post("/login" , async(req , res) => {
    try{
        const {emailId , passWord} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPassWordValid = await bcrypt.compare(passWord, user.passWord);
        if(isPassWordValid){
            res.send("User login successfully");
        }
        else{
            throw new Error("Invalid credentials");
        }

    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})

// Api for updating the user 
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const Allowed_updates = ["photoUrl" , "about" , "gender" , "age" , "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => Allowed_updates.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills can not more than 10");
        }
        const user = await User.findByIdAndUpdate(
            { _id: userId },
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        console.log(user);
        res.send("User updated successfully");
    }
    catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message);
    }
});



connectDB()
    .then(() => {
        console.log("Database is connected fine...");
        app.listen(1000 , () => {
            console.log("Server is running at port 1000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });