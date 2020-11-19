'use srict';

const dotenv = require('dotenv');

dotenv.config();

const consol = require('./sconsole');
const sourceFile = require('./sfile');
const questioner = require('./questioner');
const utils = require('./utils');

async function main() {
  // get base
  let recipes = await sourceFile.read(`${__dirname}\\${process.env.DATA_RECIPES}`);
  let ings = await sourceFile.read(`${__dirname}\\${process.env.DATA_INGRIDIENTS}`);
  let catg = await sourceFile.read(`${__dirname}\\${process.env.DATA_CATEGORY}`);
  let ri = await sourceFile.read(`${__dirname}\\${process.env.DATA_RECIPES_INGRIDIENTS}`);
  recipes = JSON.parse(recipes);
  ings = JSON.parse(ings);
  catg = JSON.parse(catg);
  ri = JSON.parse(ri);
  catg.unshift({ id: 0, name: 'Exit' })

  const CHOOSE_CATEGORY = 'Coose category: ';
  function veiwCatg() {
    consol.printIdListObject(catg);
  }
  async function chooseCatg() {
    veiwCatg();
    const result = await consol.inputAnswer(CHOOSE_CATEGORY);
    return result;
  }

  consol.init();
 

  const currCatg = await chooseCatg();
  if (currCatg === 0) process.exit();

  consol.print(currCatg);
  
  // const currRecipe = chooseRecip(currCatg);

  /*
  // Get data
  const dataSource = sourceFile;
  const filePath = dataSourceSettings.parameters.currentPath
    + dataSourceSettings.parameters.fileName;
  const inData = await dataSource.read(filePath);

  // Get command
  const command = await questioner.command(userSource, utils.commands);

  if (command) result = utils.commands[command[0]].execute(inData, command[1]);
  userSource.print('\n==========  Result  ==============\n');
  userSource.print(result);
*/
  consol.close();
}
main();

/*
const rl = require('readline');

rl.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  process.stdout.write(str);
  consol.print(key);
  if (key && key.ctrl && key.name == 'c') process.exit();
}) */
