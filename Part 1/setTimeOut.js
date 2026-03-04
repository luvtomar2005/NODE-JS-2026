console.log("Understanding the concept of 0 ms in set time out");


var a = 10;
var b = 20;

// execute after the current call stack is empty and timer has expired
setTimeout(() => {
    console.log("Print me")
} , 0);

setTimeout(() => {
    console.log("I will also be printed")
} , 10);


function sum(x , y){
    const result = a + b;
    return result;
}
var c = sum(a,b);
console.log("The sum result is " , c);
