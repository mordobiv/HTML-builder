const { stdin, stdout, exit } = process;
const path = require('path');
const fs = require('fs');
const outputFileName = 'output.txt';
const outputFileAbsolutName = path.join(__dirname, outputFileName);
const output = fs.createWriteStream(outputFileAbsolutName);

stdout.write("Hello! Please enter any text:\n")

stdin.on('data', data => {
  if (data.toString() === 'exit\n') {
    stdout.write('\nThanks, bye!');
    exit();
  }
  output.write(data);
  console.log(data.toString());
})

process.on('SIGINT', () => {
  stdout.write('\nThanks, bye!\n');
  exit();
})