/**
 Console service
 */

const readline = require('readline');

let rl;

function answer(question) {
  const promise = new Promise((resolve) => {
    rl.question(`${question}\n`, (ans) => {
      resolve(ans.trim());
    });
  });
  return promise;
}

function edit(text) {
  const promise = new Promise((resolve) => {
    rl.write(text);
    rl.on('line', (line) => {
      resolve(line.trim());
    });
  });
  return promise;
}

async function confirm(question) {
  const promise = new Promise((resolve) => {
    rl.question(` ${question} Y/N `, (ans) => {
      if (ans.trim().toLowerCase() === 'y') resolve(true);
      else resolve(false);
    });
  });
  return promise;
}

function readLineInit() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
  });
}

function readLineClose() {
  rl.close();
}

module.exports = {
  init: () => readLineInit(),
  close: () => readLineClose(),
  inputAnswer: (question) => answer(question),
  edit: (text) => edit(text),
  confirm: (question) => confirm(question),
};
