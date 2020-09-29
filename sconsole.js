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

const readline = require('readline');

let rl;
function log(...args) {
  console.log(args);
}

function cnslPrint(text = '') {
  log(text);
}

function cnslPrintList(arr) {
  arr.forEach((value) => {
    log(value);
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

function cnslPrintOrderedListColumn(arr, color = 'cyan') {
  const COLUMNS = 3;
  let arrStr = '\n';
  arr.forEach((value, index) => {
    arrStr += `${colors[color]} [${index}] ${colors.reset} ${value} \t\t `;
    if (((index + 1) % COLUMNS) === 0) {
      console.log(`${arrStr}`);
      arrStr = '';
    }
  });
  console.log();
}

function cnslPrintWaring(text, level = 'waring') {
  console.log(`${colors[levels[level]]} ${text} ${colors.reset} `);
}

async function cnslInputAnswer(question) {
  const promise = new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
  const result = await promise;
  return result;
}

function cnslClear() {
  rl.write(null, { ctrl: true, name: 'l' });
}

function cnslInit() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Input> ', // .env   npm .env
  });
}

function cnslClose() {
  rl.close();
}

const sourceConsole = () => ({
  init: () => cnslInit(),
  close: () => cnslClose(),
  print: (text) => cnslPrint(text),
  printList: (arr) => cnslPrintList(arr),
  printOrderedList: (arr, col) => cnslPrintOrderedList(arr, col),
  printOrderedListColumn: (arr, col) => cnslPrintOrderedListColumn(arr, col),
  printWaring: (text, level) => cnslPrintWaring(text, level),
  inputAnswer: (question) => cnslInputAnswer(question),
  clearScreen: () => cnslClear(),
});

module.exports.create = sourceConsole;
