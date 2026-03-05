const express = require('express');

const app = express();

// This will only handle the get call..
app.get('/user' ,  (req , res) => {
    res.send({firstName : "Luv Tomar"});
})
app.post('/user' ,  (req , res) => {
    res.send("data added sucessfully");
})
app.use('/checking', (req,res)=>{
    res.send("Checking page");
});


app.use('/testing', (req,res)=>{
    res.send("Server is running fine");
});

app.use('/', (req,res)=>{
    res.send("Hello from dashboard");
});






app.listen(1000 , () => {
    console.log("Server is successfully running on port 1000");
});



