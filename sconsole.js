/**
 Console source
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
function log(text) {
  console.log(text);
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
  const arrStr = [''];
  let counter = 0;
  arr.forEach((value, index) => {
    arrStr[counter] += `${colors[color]} [${index}] ${colors.reset} ${value} \t\t `;
    if (((index + 1) % COLUMNS) === 0) arrStr[++counter] = '';
  });
  log(arrStr.join('\n'));
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

async function cnsInterrogator(question, callDo, callCheck) {
  log(question);
  rl.prompt();
  const promise = new Promise((resolve) => {
    rl.on('line', (line) => {
      if (callCheck(line.trim())) resolve(callCheck(line.trim()));
      else {
        callDo(line);
        rl.prompt();
      }
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
  interrogator: (question, callDo, callWhile) => cnsInterrogator(question, callDo, callWhile),
  clearScreen: () => cnslClear(),
});

module.exports.create = sourceConsole;
