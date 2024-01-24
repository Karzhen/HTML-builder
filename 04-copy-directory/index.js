const fs = require('fs');
const path = require('path');
const filesFolderPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

async function copyFiles(sourcePath, destinationPath) {
  try {
    // Обработка обнуления папки
    try {
      await fs.promises.access(destinationPath);
      await fs.promises.rm(destinationPath, { force: true, recursive: true });
      console.log(`Removed existing folder: ${destinationPath}`);
    } catch (error) {
      /* empty */
    }
    await fs.promises.mkdir(destinationPath, { recursive: true });
    console.log(`Directory ${destinationPath} created successfully!`);

    const files = await fs.promises.readdir(sourcePath);
    const filesCopy = await fs.promises.readdir(destinationPath);

    for (const file of filesCopy) {
      if (!files.includes(file)) {
        const filePathToRemove = path.join(destinationPath, file);
        await fs.promises.unlink(filePathToRemove);
        console.log(`File ${file} has been removed from files-copy.`);
      }
    }

    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);

      // const sourceStat = await fs.promises.stat(sourceFilePath);
      // if (sourceStat.isDirectory()) {
      //   await copyFiles(sourceFilePath, destinationFilePath);
      // } else {
      //   const destinationStat = await fs.promises
      //     .stat(destinationFilePath)
      //     .catch(() => null);
      //
      //   if (!destinationStat || sourceStat.mtimeMs > destinationStat.mtimeMs) {
      //     await fs.promises.copyFile(sourceFilePath, destinationFilePath);
      //     console.log(`File ${file} has been updated in files-copy.`);
      //   }
      // }
      const sourceStat = await fs.promises.stat(sourceFilePath);
      const destinationStat = await fs.promises
        .stat(destinationFilePath)
        .catch(() => null);

      if (!destinationStat || sourceStat.mtimeMs > destinationStat.mtimeMs) {
        await fs.promises.copyFile(sourceFilePath, destinationFilePath);
        console.log(`File ${file} has been updated in files-copy.`);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

copyFiles(filesFolderPath, filesCopyPath);
