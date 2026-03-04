// event loop 3 example

const fs = require("fs");
setImmediate(() => console.log("Set immediate"));

setTimeout(() => console.log("this is printed because timer has expired now") , 0);

Promise.resolve(() => console.log("Promise"));

fs.readFile("./file.txt" , "utf8" , () => {
    setTimeout(() => console.log("2nd Timer") , 0);
    process.nextTick(() => console.log("2nd nexttick"));
    setImmediate(() => console.log("set immediate is printed now "));
    console.log("File reading Call back queue");
})

process.nextTick(() => console.log("This has called now (promise.nextTick)"));

console.log("Although this is the last line but it will be printed first ");