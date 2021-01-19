/*
 Data Service
*/
const fs = require('fs');

async function fileRead(fName) {
  return new Promise((resolve) => {
    fs.readFile(fName, 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
}

async function fileWrite(fName, data) {
  if (data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fName, data, 'utf8', (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  };
}

async function readData(fileName) {
  try {
    const dataJSON = await fileRead(fileName);
    return JSON.parse(dataJSON);
  } catch (error) {
    console.log(error);
  }
}

async function saveData(fileName, data) {
  try {
    const serialiseJSON = JSON.stringify(data, null, 2);
    return fileWrite(fileName, serialiseJSON);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  readData,
  saveData,
};
