// var a = "Hello Luv"
require("./xyz.js")
// console.log(a);
// const {x , calculateSum}= require('./calculate/sum.js')
// const {calculateMultiply} = require('./calculate/multiply.js')
const { calculateSum, calculateMultiply } = require('./calculate');

console.log(calculateSum(10, 20));
console.log(calculateMultiply(10, 20));

const a = 10;
const b = 20;
// console.log(this); // empty object

// console.log(globalThis === global);


// console.log(x);

