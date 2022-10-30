const fs = require('fs');
const path = require('path');
const dirName = 'files'
const dirAbsolutePath = path.join(__dirname, dirName);
const newDirName = 'files-copy';
const newDirAbsolutePath = path.join(__dirname, newDirName);

fs.rm(newDirAbsolutePath, { force: true, recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  fs.mkdir(newDirAbsolutePath, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    fs.readdir(dirAbsolutePath, 
      (err, files) => {
        if (err) {
          return console.error(err);
        }
        
        for (file of files) {
          const fullFilePath = path.join(dirAbsolutePath, file)
          const newFullFilePath = path.join(newDirAbsolutePath, file)
          fs.copyFile(fullFilePath, newFullFilePath, (err) => {
            if (err) {
              return console.error(err);
            }
          });
        }
        console.log("Directory is copied!");
      }
    )
  });
});
