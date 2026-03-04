// async.js
// Demonstrating how libuv enables non-blocking behavior in Node.js

const fs = require("fs");
const https = require("https");

console.log("This line is printed");
var a = 10;
var b = 20;
https.get(
  "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING",
  (res) => {
    console.log("HTTPS data loaded successfully");

  
  }
);
setTimeout(() => {
  console.log("setTimeout callback executed");
}, 2000);

fs.readFile("./file.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File Data:", data);
});

function multiply(x, y) {
  return x * y;
}

multiply(a, b);
