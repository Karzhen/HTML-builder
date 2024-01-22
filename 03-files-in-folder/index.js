const fs = require('fs');
const path = require('node:path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, (error, files) => {
  if (error) {
    console.error('The error occurred');
    process.exit(1);
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolderPath, file);

    fs.stat(filePath, (error, stats) => {
      if (error) {
        console.error('The error occurred');
        console.log(error);
        process.exit(1);
      }

      if (stats.isFile()) {
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        const fileSize = stats.size;
        // Note: no rounding for file size is necessary; conversion to kB is optional!
        // But it is my choice =)
        console.log(
          `${fileName} - ${fileExtension.slice(1)} - ${(
            fileSize / 1024
          ).toFixed(3)}Kb`,
        );
        // Below is the line without rounding the data
        // console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSize}`);
      }
    });
  });
});
