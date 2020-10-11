/**
 File source
 */

const fs = require('fs');

const isFile = (fullFileName) => fs.lstatSync(fullFileName).isFile();

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

module.exports = {
  read: (fName) => fileRead(fName),
};
