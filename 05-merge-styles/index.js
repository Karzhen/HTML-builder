const fs = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectPath, 'bundle.css');

async function copyStyles(stylesPath, projectDistPath) {
  try {
    const files = await fs.promises.readdir(stylesPath);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const readPromises = cssFiles.map((file) =>
      fs.promises.readFile(path.join(stylesPath, file), 'utf8'),
    );
    const contents = await Promise.all(readPromises);
    const writeStream = fs.createWriteStream(projectDistPath);

    for (const content of contents) {
      writeStream.write(content);
    }
    writeStream.end();
  } catch (error) {
    console.error('The error occurred', error);
    process.exit(1);
  }
}

copyStyles(stylesFolderPath, bundlePath);
