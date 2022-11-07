const fs = require('fs');
const path = require('path');
const stylesDirName = 'styles'
const stylesDirAbsolutePath = path.join(__dirname, stylesDirName);
const bundleFileName = 'bundle.css';
const bundleFileAbsolutePath = path.join(__dirname, 'project-dist', bundleFileName);

fs.rm(bundleFileAbsolutePath, { force: true }, (err) => { 
  if (err) return console.error(err);

  fs.readdir(stylesDirAbsolutePath,
  { withFileTypes: true }, 
  (err, files) => {
    if (err) return console.error(err);

    const output = fs.createWriteStream(bundleFileAbsolutePath);
    for (file of files) {
      let parsedFile = path.parse(file.name);
      if (parsedFile.ext !== '.css' || !file.isFile()) continue;

      const input = fs.createReadStream(path.join(stylesDirAbsolutePath, file.name), 'utf-8');
      input.on('data', chunk => output.write(chunk + '\n'));
    }
  })
})