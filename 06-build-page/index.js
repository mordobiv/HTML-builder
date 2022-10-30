const fs = require('fs');
const path = require('path');
const mainDirAbsolutePath = path.join(__dirname, 'project-dist');


removeAndCreateDir(mainDirAbsolutePath, () => {
  composeHtml();
  proceedStyles();
  copyAssets();
})

function composeHtml() {
  const templateAbsolutePath = path.join(__dirname, 'template.html');
  const readStream = fs.createReadStream(templateAbsolutePath, 'utf-8');
  let htmlFileContent = '';
  let htmlNodes = [];
  readStream.on('data', chunk => {
    htmlFileContent += chunk;
  });

  readStream.on('end', (err) => {
    if (err) return console.error(err);
    htmlNodes = htmlFileContent.split('\n');
    let promises = []
    for (let i = 0; i < htmlNodes.length; i++) {
      if (htmlNodes[i].indexOf('{{') !== -1) {
        let promise = new Promise(function(resolve) {
          const node = htmlNodes[i].split('{{')[1].split('}}')[0]
          const nodeHtmlFile = path.join(__dirname, 'components', `${node}.html`);
          const nodeReadStream = fs.createReadStream(nodeHtmlFile, 'utf-8');
          let nodeContent = '';
          nodeReadStream.on('data', chunk => nodeContent += chunk);
          nodeReadStream.on('end', (err) => {
            if (err) return console.error(err);
            htmlNodes[i] = nodeContent;
            resolve();
          })
        })
        promises.push(promise);
      }
    }

    Promise.allSettled(promises).then(() => {
      const output = fs.createWriteStream(path.join(mainDirAbsolutePath, 'index.html'));
      let formattedHtml = '';
      for (let node of htmlNodes) {
        formattedHtml += node + '\n';
      }
      output.write(formattedHtml);
    })
  })
}

function copyAssets(oldPath, newPath) {
  const assetsAbsolutePath = path.join(__dirname, 'assets');
  const newAssetsAbsolutePath = path.join(mainDirAbsolutePath, 'assets');
  removeAndCreateDir(newAssetsAbsolutePath, function proceedDir(dirname) {
    const pathToCheck = dirname || '';
    fs.readdir(path.join(assetsAbsolutePath, pathToCheck), 
      { withFileTypes: true }, 
      (err, files) => {
        if (err) {
          return console.error(err);
        }
        
        for (file of files) {
          if (!file.isFile()) {
            proceedDir(file.name);
            fs.mkdir(path.join(newAssetsAbsolutePath, file.name), { recursive: true }, (err) => {
              if (err) return console.error(err);
            });
            continue;
          }

          const fullFilePath = path.join(assetsAbsolutePath, pathToCheck, file.name);
          const newFullFilePath = path.join(newAssetsAbsolutePath, pathToCheck, file.name);
          fs.copyFile(fullFilePath, newFullFilePath, (err) => {
          if (err) {
            return console.error(err);
          }
        });
      }
    })
  })
}

function proceedStyles () {
  const stylesAbsolutePath = path.join(__dirname, 'styles');
  fs.readdir(stylesAbsolutePath,
    { withFileTypes: true }, 
    (err, files) => {
      if (err) return console.error(err);
  
      const output = fs.createWriteStream(path.join(mainDirAbsolutePath, 'style.css'));
      for (file of files) {
        let parsedFile = path.parse(file.name);
        if (parsedFile.ext !== '.css' || !file.isFile) continue;
  
        const input = fs.createReadStream(path.join(stylesAbsolutePath, file.name), 'utf-8');
        input.pipe(output);
      }
    }
  )
}

function removeAndCreateDir(dirname, func) {
  fs.rm(dirname, { force: true, recursive: true }, (err) => { 
    if (err) return console.error(err);
    
    fs.mkdir(dirname, { recursive: true }, (err) => {
      if (err) return console.error(err);

      func();
    })
  })
}