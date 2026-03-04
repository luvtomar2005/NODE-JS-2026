// Understanding the event loop example 1

const fs = require("fs");
const a = 10;

setImmediate(() => console.log("Set Immediate is called"));

fs.readFile("./file.txt" , "utf-8" , () => {
    console.log("File read is completed");
})

setTimeout(() => console.log("Timer has done working here") , 0);

function callA(){
    console.log("A is being called as" , a);
}

callA();
console.log("This is the last line of the code and our code has sucessfully called");