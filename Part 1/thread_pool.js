// Understanding the working of thread pool in Node.js

const fs = require("fs");      // does NOT init thread pool
const crypto = require("crypto");
const { exitCode } = require("process");
const { Http2ServerRequest } = require("http2");

// Works ONLY because no thread-pool task has run yet
process.env.UV_THREADPOOL_SIZE = 2;

const start = Date.now();

crypto.pbkdf2("password", "salt", 5000000, 50, "sha512", () => {
  console.log("1 - cryptoPBKDF2 done at", Date.now() - start, "ms");
});

crypto.pbkdf2("password", "salt", 5000000, 50, "sha512", () => {
  console.log("2 - cryptoPBKDF2 done at", Date.now() - start, "ms");
});

crypto.pbkdf2("password", "salt", 5000000, 50, "sha512", () => {
  console.log("3 - cryptoPBKDF2 done at", Date.now() - start, "ms");
});

crypto.pbkdf2("password", "salt", 5000000, 50, "sha512", () => {
  console.log("4 - cryptoPBKDF2 done at", Date.now() - start, "ms");
});

