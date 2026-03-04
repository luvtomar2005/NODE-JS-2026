// Understanding the event loop example 2

const fs = require("fs");
const a = 120;

Promise.resolve("Promise is resolved");

fs.readFile("./file.txt" , "utf-8" , () => {
    console.log("Reading the file is completed");
})

setTimeout(() => console.log("Timer Expired") , 0);

process.nextTick(() => console.log("Process .nextTick is executed"));

function printA(){
    console.log("Function is printed now");
}

printA();
console.log("This line is printed after printing of every line");