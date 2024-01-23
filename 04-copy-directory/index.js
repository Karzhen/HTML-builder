const fs = require('fs');
const path = require('node:path');
const filesFolderPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

fs.mkdir(filesCopyPath, { recursive: true }, (error) => {
  if (error) {
    console.error('The error occurred', error);
    process.exit(1);
  }
  console.log('Directory created successfully!');
});

fs.readdir(filesFolderPath, (error, files) => {
  if (error) {
    console.error('The error occurred', error);
    process.exit(1);
  }

  files.forEach((file) => {
    const sourceFilePath = path.join(filesFolderPath, file);
    const destinationFilePath = path.join(filesCopyPath, file);
    fs.copyFile(sourceFilePath, destinationFilePath, (error) => {
      if (error) {
        console.error('Error when copying a file:', error);
      } else {
        console.log(`The file ${file} has been successfully copied.`);
      }
    });
  });
});
