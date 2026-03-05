const express = require('express');

const app = express();

app.listen(1000 , () => {
    console.log("Server is successfully running on port 1000");
});

app.get('/testing', (req,res)=>{
    res.send("Server is running fine");
});

app.get('/checking', (req,res)=>{
    res.send("Checking page");
});

app.get('/', (req,res)=>{
    res.send("Hello from dashboard");
});