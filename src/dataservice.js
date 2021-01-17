const dataservice = require('./fileservice');
const Repository = require('./repositories');
const Catalog = require('./category-tree');

async function init(options) {
  const category = new Catalog(await dataservice
    .readData(options.dataFiles.category));
  const recipes = new Repository(await dataservice
    .readData(options.dataFiles.recipes));
  const ingredients = new Repository(await dataservice
    .readData(options.dataFiles.ingredients));
  return { category, recipes, ingredients };
}

module.exports = init;
