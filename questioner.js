/**
 Questioner Fabric
 */
const fs = require('fs');
const pathModule = require('path');

const NO_FOLDERS = 'no folders';
const NO_FILES = 'no files';
const CURRENT_DIR = 'Current folder - ';
const CURRENT_FILE = 'Current file - ';
const CHANGE_DIR = 'Change dir? [Y/N] ';
const CHANGE_FILE = 'Change file? [Y/N] ';
const CHOOSE_FILE = 'Choose file: ';
const CHOOSE_SOURCE = 'Choose the source [N]: ';
const CHOOSE_COMMAND = 'Choose the command [N]: ';
const HELP_DIR = '\nFolder number to enter it    or   y - to choose current folder';
const YES = 'y';
const WRONG_NUMBER = 'Wrong number';

const isFile = (fullFileName) => fs.lstatSync(fullFileName).isFile();

function dirList(path) {
  const folders = fs.readdirSync(path).filter((fileName) => !isFile(path + fileName));
  folders.unshift('..');
  if (folders.length === 0) folders[0] = NO_FOLDERS;
  return folders;
}

function fileList(path) {
  const files = fs.readdirSync(path).filter((fileName) => isFile(path + fileName));
  if (files.length === 0) files[0] = NO_FILES;
  return files;
}

async function changeDirectory(userSource, dir) {
  let list = [];
  let curDir = dir;

  userSource.clearScreen();
  list = dirList(curDir);
  userSource.printOrderedListColumn(list);

  const result = await userSource.interrogator(HELP_DIR, (cDir) => {
    if (list[+cDir]) {
      if (cDir > 0) curDir += `${list[cDir]}\\`;
      else curDir = `${pathModule.dirname(curDir)}\\`;
      userSource.clearScreen();
      userSource.print(`\n${CURRENT_DIR} ${curDir}`);
      list = dirList(curDir);
      userSource.printOrderedListColumn(list);
      userSource.print('\n');
    } else userSource.printWaring(WRONG_NUMBER, 'warning');
  }, (cDir) => {
    if (cDir.toLowerCase() === YES) return curDir;
    return null;
  });
  return result;
}

async function chooseFile(userSource, dir) {
  const listFiles = fileList(dir);
  userSource.clearScreen();
  userSource.print('\n');
  userSource.printOrderedListColumn(listFiles);

  const result = await userSource.interrogator(`\n${CHOOSE_FILE}`, () => {
    userSource.clearScreen();
    userSource.print(`\n${CURRENT_DIR} ${dir}\n`);
    userSource.printOrderedListColumn(listFiles);
    userSource.print('\n');
    userSource.printWaring(WRONG_NUMBER, 'warning');
    userSource.print(CHOOSE_FILE);
  }, (cFile) => {
    if (listFiles[+cFile]) return listFiles[cFile];
    return null;
  });
  return result;
}

async function fileQuestioner(userSource, defaults) {
  userSource.clearScreen();
  const resultSettings = {};// = defaults.parameters;
  let dir = defaults.parameters.currentPath;
  let file = defaults.parameters.fileName;

  userSource.print(`\n${CURRENT_DIR} ${dir}\n`);
  const cd = await userSource.inputAnswer(CHANGE_DIR);
  if (cd.toLowerCase() === YES) dir = await changeDirectory(userSource, dir);

  userSource.print(`\n${CURRENT_FILE} ${file}\n`);
  const cf = await userSource.inputAnswer(CHANGE_FILE);
  if (cf.toLowerCase() === YES) file = await chooseFile(userSource, dir);

  resultSettings.currentPath = dir;
  resultSettings.fileName = file;

  return resultSettings;
}

async function chooseSource(list, userSource, def) {
  userSource.printOrderedListColumn(list);
  const result = await userSource.inputAnswer(CHOOSE_SOURCE);
  if (list[result]) return list[result];
  userSource.printWaring(WRONG_NUMBER, 'warning');
  return def;
}

async function inputCommand(userSource, listCommands) {
  let chooseCoomand = 0;
  const arrCommands = listCommands.map((item) => item.descr);
  userSource.clearScreen();
  userSource.print('\n');
  userSource.printOrderedList(arrCommands);

  const resCom = await userSource.inputAnswer(CHOOSE_COMMAND);
  if (arrCommands[resCom]) chooseCoomand = resCom;
  else {
    userSource.printWaring(WRONG_NUMBER, 'warning');
    return null;
  }

  const resPar = await userSource.inputAnswer(listCommands[chooseCoomand].desParam);
  return [chooseCoomand, resPar];
}

const receiver = {
  file: (userSource, defaults) => fileQuestioner(userSource, defaults),
};

module.exports = {
  source: (list, source, def) => chooseSource(list, source, def),
  settings: (sourceName, userSource, defaults) => receiver[sourceName](userSource, defaults),
  command: (userSource, listCommands) => inputCommand(userSource, listCommands),
};
