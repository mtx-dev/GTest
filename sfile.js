/**
 File source
 */

const fs = require('fs');

const isFile = (fullFileName) => fs.lstatSync(fullFileName).isFile();

function filePrint(text = '') {
}

function filePrintList(arr) {
}

function filePrintOrderedList(arr) {

}

function filePrintOrderedListColumn(arr) {

}

function filePrintWaring(text, level = 'waring') {

}

async function fileInputAnswer(question) {

}

function fileClear() {

}

const fileInit = () => ({

});

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
  init: () => fileInit(),
  read: (fName) => fileRead(fName),
  close: () => fileClose(),

  print: (text) => filePrint(text),
  printList: (arr) => filePrintList(arr),
  printOrderedList: (arr, col) => filePrintOrderedList(arr, col),
  printOrderedListColumn: (arr, col) => filePrintOrderedListColumn(arr, col),
  printWaring: (text, level) => filePrintWaring(text, level),

  inputAnswer: (question) => fileInputAnswer(question),
  clearScreen: () => fileClear(),
});

module.exports.create = sourceFile;
