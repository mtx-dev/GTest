/**
 Console service
 */

 
const readline = require('readline');
const Cursor = require('./cursor');

const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgBrBlack: '\x1b[100m',
};

const levels = {
  log: 'Reset',
  warning: 'FgYellow',
  list: 'FgCyan',
  alert: 'FgRed',
};


let rl;

function log(text = '', color = undefined) {
  if (color) console.log(`${colors[color]}${text}${colors.Reset}`);
  else console.log(text);
}

function print(text) {
  log(text);
}

function printOrdList(arr, cursor = undefined) {
  const color = 'FgCyan';
  const cursColor = 'BgCyan';
  arr.forEach((value, i) => {
    if (i === cursor) {
      const str = `${colors[cursColor]} [${i}]  ${value} ${colors.Reset}`;
      log(str);
    } else log(`${colors[color]} [${i}] ${colors.Reset} ${value}`);
  });
}

function printIdList(arr, cursor = undefined) {
  // arr  = [ {id, name} ]
  const color = 'FgCyan';
  const cursColor = 'BgCyan';
  arr.forEach((value, i) => {
    if (i === cursor) {
      const str = `${colors[cursColor]} [${arr[i].id}]  ${arr[i].name} ${colors.Reset}`;
      log(str);
    } else log(`${colors[color]} [${arr[i].id}] ${colors.Reset} ${arr[i].name}`);
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

function waring(text, level = 'waring') {
  log(`${colors[levels[level]]} ${text} ${colors.Reset} `);
}

function answer(question) {
  const promise = new Promise((resolve) => {
    rl.question(`${question}\n`, (answer) => {
      resolve(answer.trim());
    });
  });
  return promise;
}

async function interrogator(question, callDo, callCheck) {
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
  return promise;
}

function clear() {
  rl.write(null, { ctrl: true, name: 'l' });
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

async function chooseItemIdList(list, title = '') {
  const cur = new Cursor(list);
  clear();
  log(title);
  printIdList(list, cur.position);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  const promise = new Promise((resolve) => {
    process.stdin.on('keypress', (str, key) => {
      switch (key.name) {
        case 'up':
          cur.up();
          break;
        case 'down':
          cur.down();
          break;
        case 'return':
          resolve(list[cur.position]);
          break;
        default:
          break;
      }
      clear();
      //console.clear();
      log(title);
      printIdList(list, cur.position);
    });
  });
  return promise;
}

/* async function main() {
  readLineInit();

  const ab = [{ id: 1, name: '2dggd' }, { id: 2, name: 'fgdg2' },
    { id: 3, name: '2dgggd' }, { id: 4, name: 'gfdg2' },
    { id: 5, name: '233434ers' }, { id: 6, name: 'fggd2' }];
  log(await chooseItemIdList(ab, 'Title ------------'));
  // await asa();
  readLineClose();
}
main();
*/
module.exports = {
  init: () => readLineInit(),
  close: () => readLineClose(),
  print: (text) => print(text),
  printList: (arr) => cnslPrintList(arr),
  printOrderedList: (arr, color) => printOrdList(arr, color),
  printIdList: (arr, color) => printIdList(arr, color),
  chooseItemIdList: (list, title) => chooseItemIdList(list, title),
  // printOrderedListColumn: (arr, color) => cnslPrintOrderedListColumn(arr, color),
  // printWaring: (text, level) => cnslPrintWaring(text, level),
  inputAnswer: (question) => answer(question),
  // interrogator: (question, callDo, callWhile) => cnsInterrogator(question, callDo, callWhile),
  // clearScreen: () => cnslClear(),
};
