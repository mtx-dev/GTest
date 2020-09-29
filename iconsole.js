/**
 Coonsole Interface
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

const levels = {
  log: 'reset',
  warning: 'yellow',
  list: 'cyan',
  alert: 'red',
};

const { resolve } = require('path');
const readline = require('readline');

let rl;

function cnslPrint(text = '') {
  console.log(text);
}

function cnslPrintList(arr) {
  arr.forEach((value) => {
    console.log(value);
  });
}

function cnslPrintOrderedList(arr, color = 'cyan') {
  let i = 0;
  arr.forEach((value) => {
    const str = `${colors[color]} [${i}] ${colors.reset} ${value}`;
    console.log(str);
    i += 1;
  });
}

function cnslPrintListColumn(arr) {
  const COLUMNS = 3;
  let arrStr = '\n';
  let i = 0;
  arr.forEach((value) => {
    arrStr += `${value} \t\t `;
    if (((i + 1) % COLUMNS) === 0) {
      console.log(`${arrStr}`);
      arrStr = '';
    }
    i += 1;
  });
  console.log();
}

function cnslPrintOrderedListColumn(arr, color = 'cyan') {
  const COLUMNS = 3;
  let arrStr = '\n';
  let i = 0;
  arr.forEach((value) => {
    arrStr += `${colors[color]} [${i}] ${colors.reset} ${value} \t\t `;
    if (((i + 1) % COLUMNS) === 0) {
      console.log(`${arrStr}`);
      arrStr = '';
    }
    i += 1;
  });
  console.log();
}

function cnslPrintWaring(text, level = 'waring') {
  console.log(`${colors[levels[level]]} ${text} ${colors.reset} `);
}

/* function cnslWrite(text) {
  rl.write(text);
} */

async function cnslInputAnswer(question) {
  const promise = new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
  const result = await promise;
  // console.log(result);
  // process.exit(0);
  return result;
}

function cnslClear() {
  rl.write(null, { ctrl: true, name: 'l' });
}

function cnslInit() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Input> ',
  });
}

function cnslClose() {
  rl.close();
}

const intface = () => ({
  init: () => cnslInit(),
  close: () => cnslClose(),
  print: (text) => cnslPrint(text),
  printList: (arr) => cnslPrintList(arr),
  printListColumn: (arr) => cnslPrintListColumn(arr),
  printOrderedList: (arr, col) => cnslPrintOrderedList(arr, col),
  printOrderedListColumn: (arr, col) => cnslPrintOrderedListColumn(arr, col),
  printWaring: (text, level) => cnslPrintWaring(text, level),
  inputAnswer: (question) => cnslInputAnswer(question),
  clearScreen: () => cnslClear(),
});

module.exports.create = intface;
