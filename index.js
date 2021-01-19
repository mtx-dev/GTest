'use srict';

const dotenv = require('dotenv');

dotenv.config();

const options = require('./config/config');
const { readData } = require('./src/dataservice');
const RecipeController = require('./src/controller');
const Invoker = require('./src/command');
const Navigator = require('./src/navigator');

async function main() {
  const data = await readData(options);
  const controller = new RecipeController(data);
  const commands = new Invoker(controller);
  const navigator = new Navigator(commands);
  await navigator.start();
}
main();
