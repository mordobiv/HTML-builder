const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

function getFileTypeSymbol(el) {
  return el[Object.getOwnPropertySymbols(el)[0]]
}

fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
    for (file of files) {
      if (getFileTypeSymbol(file) !== 1) continue;
      let parsedFile = path.parse(file.name);
      let resStr = "```" + parsedFile.name + ' - ' + parsedFile.ext.replace('.', '') + ' - ';
      fs.stat(path.join(dirPath, file.name), (err, stats) => {
        resStr += stats.size +'b' + '```';
        console.log(resStr);
      })
    }
  }
)