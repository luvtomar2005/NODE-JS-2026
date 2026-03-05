// const express = require('express');

// const app = express();

// // This will only handle the get call..
// app.get('/user' ,  (req , res) => {
//     res.send({firstName : "Luv Tomar"});
// })
// app.post('/user' ,  (req , res) => {
//     res.send("data added sucessfully");
// })
// app.use('/checking', (req,res)=>{
//     res.send("Checking page");
// });


// app.use('/testing', (req,res)=>{
//     res.send("Server is running fine");
// });

// app.use('/', (req,res)=>{
//     res.send("Hello from dashboard");
// });


// app.listen(1000 , () => {
//     console.log("Server is successfully running on port 1000");
// });

/* Understanding routing in more detail */

// const express = require('express');

// const app = express();

// app.use('/user' ,[ (req , res , next) => {
//     console.log("This is the route 1");
//     // res.send("Response1 !");
//     next();
// },
// (req , res, next) => {
//     console.log("This is the response 2");
//     // res.send("Response2 !");
//     next();
// }],
// (req , res , next) => {
//     console.log('This is the route3 ');
//     next();
//     res.send("Response3 !");
    
// },
// (req , res , next) => {
//     console.log("This is the route 4");
//      next();
//     res.send("Response4 !");
   
// },
// (req , res , next) => {
//     console.log("This is the route 5");
//     res.send("Response5 !");
//     next();
// }

// )

// app.listen(1000 , () => {
//     console.log("Server is running sucessfully at port 1000");
// })

/* Going more deep in router */

const express = require('express');
const app = express();

const { adminAuth } = require('./middleware/auth');

app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req,res)=>{
    res.send("All data sent");
});

app.delete('/admin/deleteUserData', (req,res)=>{
    res.send("All data deleted");
});

app.listen(1000, ()=>{
    console.log("Server running at port 1000");
});