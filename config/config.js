/*
 Config
*/

const path = require('path');

const mainPath = path.join(path.dirname(__dirname), 'base');

const options = {
  dataFiles: {
    category: path.join(mainPath, process.env.DATA_CATEGORY),
    recipes: path.join(mainPath, process.env.DATA_RECIPES),
    ingredients: path.join(mainPath, process.env.DATA_INGREDIENTS),
    // recipesIngredients: path.join(mainPath, process.env.INDX_RECIPES_INGREDIENTS),
  },
};

module.exports = options;
