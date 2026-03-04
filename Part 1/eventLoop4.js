// event loop example 4

const fs = require("fs");

setImmediate(() => {
    console.log("Set Immediate");
})

setTimeout(() => {
    console.log("Set time out has been executed");
})
Promise.resolve().then(() => console.log("Promise executed"));


process.nextTick(() => {
    process.nextTick(() => console.log("inner next tick has been called"));
    console.log("outer next tick");
})
console.log("This is the first line of the code to be printed");