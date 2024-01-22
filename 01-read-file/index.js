const fs = require('fs');
const path = require('node:path');
const pathToTextTXT = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(`${pathToTextTXT}`);
readStream.on('data', (data) => {
  console.log(data.toString());
});
