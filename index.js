'use srict';

const dotenv = require('dotenv');

dotenv.config();

const options = require('./config/config');
const initData = require('./src/dataservice');
const RecipeController = require('./src/controller');
const Invoker = require('./src/command');
const Runner = require('./src/runner');

// const questioner = require('./questioner');
// const utils = require('./utils');

async function main() {
  // Get data
  const data = await initData(options);
  const controller = new RecipeController(data);
  const commands = new Invoker(controller);
  const run = new Runner(commands);
  run.start();

  
  //run.exit();
// console.log(controller);
  /*  const rec5 = {
    id: 5,
    category: 2,
    name: 'chilli',
    desc: ' It tastes just as great reheated as it does freshly cooked',
    method: 'Heat the oil ',
    // ingridients: ['cheddar', 'egg', 'potatoes2', 'sugar2'],
    ingridients: ['1', '2', '3', '4'],
  };
  //console.log(recipes.getIngridietsOf(4));
  const ingridients = ['potatoes4', 'noodle soup', 'potatoes2', 'sugar'];
  recipes.addRecipeIngridiets(4, ingridients);
  recipes.updateRecipe(rec5);

  //console.log(recipes.getIngridietsOf(4));
//  console.log(data.all('ingridients'));
  recipes.deleteRecipe(5); */
  //  console.log(data.all('recipes_ingridients'));

  // browse catalog
  // crate updade delete read recipe

  /*
  catg.unshift({ id: 0, name: 'Exit' });

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
*/
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
  // consol.close();
}
main();
