

/* Connecting our database */
const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/users');

app.use(express.json()); // using express.json middleware
/* app.use(express.json()) is Express middleware used to parse incoming requests with 
JSON payloads. It converts the JSON data from the 
request body into a JavaScript object and makes it available in req.body. */


// creating signup api to adding data to database
app.post("/signup" ,  async (req , res) => {
    // creating a document instance using the model.
    const user = new User(req.body);
    
    try{
        await user.save();
        res.send("User added successfully");

    }
    catch(err){
        res.status(400).send("Error is encountered");
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

// Api for updating the user 

// Api for updating the user 
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
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