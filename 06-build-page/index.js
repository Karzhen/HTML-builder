const fs = require('fs');
const path = require('node:path');
const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(projectDistPath, 'assets');

// Скрипт из задания 04-copy-directory
async function copyDirectory(sourcePath, destinationPath) {
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

      const sourceStat = await fs.promises.stat(sourceFilePath);
      if (sourceStat.isDirectory()) {
        await copyDirectory(sourceFilePath, destinationFilePath);
      } else {
        const destinationStat = await fs.promises
          .stat(destinationFilePath)
          .catch(() => null);

        if (!destinationStat || sourceStat.mtimeMs > destinationStat.mtimeMs) {
          await fs.promises.copyFile(sourceFilePath, destinationFilePath);
          console.log(`File ${file} has been updated in files-copy.`);
        }
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

// Скрипт из задания 05-merge-styles
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

async function readTemplateFile() {
  try {
    return await fs.promises.readFile(templatePath, 'utf8');
  } catch (error) {
    console.error('The error occurred', error);
    process.exit(1);
  }
}

async function readComponent(name) {
  const filePath = path.join(componentsPath, `${name}.html`);
  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading component ${name}:`, error);
    throw error;
  }
}

async function replaceTemplateTags(templateContent) {
  const tags = templateContent.match(/{{\w+}}/g);
  if (!tags) return templateContent;

  for (const tag of tags) {
    const tagName = tag.slice(2, -2);
    const componentContent = await readComponent(tagName);
    templateContent = templateContent.replace(tag, componentContent);
  }

  return templateContent;
}

async function main() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true }, (error) => {
      if (error) {
        console.error('The error occurred', error);
        process.exit(1);
      }
      console.log(`Directory ${projectDistPath} created successfully!`);
    });
    const templateContent = await readTemplateFile();
    const replacedContent = await replaceTemplateTags(templateContent);
    console.log(replacedContent);
    const indexPath = path.join(projectDistPath, 'index.html');
    try {
      await fs.promises.writeFile(indexPath, replacedContent, 'utf8');
      console.log(`File ${indexPath} has been successfully written.`);
    } catch (error) {
      console.error(`Error writing file ${indexPath}:`, error);
    }

    await copyStyles(stylesPath, path.join(projectDistPath, 'style.css'));
    await copyDirectory(assetsPath, newAssetsPath);

    console.log('HTML page build successful');
  } catch (error) {
    console.error('The error occurred', error.message);
    process.exit(1);
  }
}

main();
