const { stdin, stdout, exit } = process;
const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));
const outputFileName = 'output.txt';
const outputFileAbsolutName = path.join(__dirname, outputFileName);

stdout.write("Please, enter your name:\n")
stdin.on('data', data => {
  stdout.write(`Hello ${data}`);
  output.write(data);
  exit();
})

