console.log("you can not use this module into another without exporting it ")

var x = "Hello Luv I Hope you are learning node js seriously"
function calculateSum(a , b){
    const sum = a + b;

    console.log(sum);
}


module.exports = {x , calculateSum};