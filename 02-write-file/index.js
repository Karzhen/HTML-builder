const fs = require('fs');
const process = require('process');
const path = require('node:path');
const pathToTextTXT = path.join(__dirname, 'text.txt');

// Открытие файла для записи в режиме write
fs.open('./02-write-file/text.txt', 'w', (err) => err && console.error(err));
const writeStream = fs.createWriteStream(`${pathToTextTXT}`);
console.log('Write what you want to output to a file');

const readline = require('readline');
const rlInOut = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rlInOut.on('line', (input) => {
  writeStream.write(`${input}\n`);

  if (input.toLowerCase() === 'exit') {
    console.log('Output is ending!');
    writeStream.end();
    process.exit();
  }
});
process.on('exit', () => {
  console.log('See ya later Alligator!');
});
