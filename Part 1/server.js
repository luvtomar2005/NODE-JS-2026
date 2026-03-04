// creating the server using the http module

const http = require("node:http");

const server = http.createServer(function(req , res){
    if(req.url === "/secretData"){
        res.end("Why are you wasting your time??")
    }
    res.end("Hello World");
})

server.listen(3000);
