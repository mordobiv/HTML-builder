const path = require('path');
const fs = require('fs');
const textFileName = 'text.txt';
const textFileAbsolutePath = path.join(__dirname, textFileName);

const readStream = fs.createReadStream(textFileAbsolutePath, 'utf-8');
readStream.on('data', chunk => console.log(chunk));