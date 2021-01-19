const fileservice = require('./fileservice');
const Repository = require('./repositories');
const Catalog = require('./category-tree');

async function readData(options) {
  const category = new Catalog(await fileservice
    .readData(options.dataFiles.category));
  const recipes = new Repository(await fileservice
    .readData(options.dataFiles.recipes));
  const ingredients = new Repository(await fileservice
    .readData(options.dataFiles.ingredients));
  return { category, recipes, ingredients };
}

async function writeData(options, { category, recipes, ingredients }) {
  fileservice.saveData(options.dataFiles.category, category.encode());
  fileservice.saveData(options.dataFiles.recipes, recipes.all());
  fileservice.saveData(options.dataFiles.ingredients, ingredients.all());
}

module.exports = { readData, writeData };
