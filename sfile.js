/**
 File source
 */

const fs = require('fs');

const isFile = (fullFileName) => fs.lstatSync(fullFileName).isFile();

function fileClose() {
  /* fs.close(file_descriptor, (err) => {
    if (err) console.error('Failed to close file', err);
    else {
      console.log('\n> File Closed successfully');
    }
  }); */
}

async function fileRead(fName) {
  const promise = new Promise((resolve) => {
    fs.readFile(fName, 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
  const result = await promise;
  return result;
}

const sourceFile = () => ({
  read: (fName) => fileRead(fName),
  close: () => fileClose(),
});

module.exports.create = sourceFile;
