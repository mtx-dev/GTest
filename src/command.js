/* eslint-disable no-underscore-dangle */
const options = require('../config/config');
const { writeData } = require('./dataservice');
const consol = require('./consoleinput');
const Presenter = require('./presenter');
const Cursor = require('./cursor');

let cursor = {};
let controller = {};
let list = {};
let helpCommands = '';
const pesenter = new Presenter();

function changeCategory() {
  list = [];
  if (controller.category.parent) {
    list.push({
      id: controller.category.parent,
      name: '..',
      type: 'category',
    });
  }
  list.push(...controller.category.children);
  list.push(...controller.getRecipesOfCategogy(controller.category.id));
  cursor = new Cursor(list);
  cursor.state = 'navigate';
}

function renderCategory() {
  console.clear();
  console.log(pesenter.listToSrting(list, cursor.position));
  console.log(helpCommands);
}

function renderRecipe() {
  console.clear();
  console.log(pesenter.recipeToString(controller.getRecipeById(cursor.id())));
  console.log(helpCommands);
}

function preparationIngredients(array) {
  const result = array.map((element) => element.trim())
    .filter((element) => element);
  return result;
}

const receiver = {
  initController(ctrl) {
    controller = ctrl;
    changeCategory();
  },

  init(commands) {
    const help = Object.keys(commands).reduce((acc, key) => {
      if (commands[key].printable) acc.push(key);
      return acc;
    }, []);
    helpCommands = pesenter.commandsToString(help);
    console.clear();
    receiver.render();
  },

  render() {
    if (cursor.state === 'navigate') {
      renderCategory();
    }
    if (cursor.state === 'view') {
      renderRecipe();
    }
  },

  enter() {
    if (cursor.type() === 'category') {
      controller.category.id = cursor.id();
      changeCategory();
    }
    if (cursor.type() === 'recipe') {
      cursor.state = 'view';
    }
    receiver.render();
  },

  help(commands) {
    console.clear();
    console.log();
    Object.keys(commands).forEach((key) => {
      if (commands[key].printable) {
        console.log(`${key}  -  ${commands[key].description}`);
      }
    });
    console.log('\nEcs to exit');
  },

  error(text) {
    receiver.render();
    console.log(pesenter.error(text));
  },

  moveDown() {
    if (cursor.state === 'navigate') {
      cursor.down();
      receiver.render();
    }
  },

  moveUp() {
    if (cursor.state === 'navigate') {
      cursor.up();
      receiver.render();
    }
  },

  del() {
    if (cursor.type() === 'recipe') {
      controller.deleteRecipe(cursor.id());
      changeCategory();
      this.render();
    } else {
      receiver.error('Choose recipe');
    }
  },

  async edit() {
    if (cursor.type() === 'recipe') {
      const recipe = controller.getRecipeById(cursor.id());
      console.clear();
      console.log(`Edit Recipre of category - ${controller.category.name}`);
      consol.init();
      const newRecipe = {};
      newRecipe.id = recipe.id;
      newRecipe.category = controller.category.id;
      console.log('Recipe name:');
      newRecipe.name = await consol.edit(recipe.name);
      console.log('Recipe description:');
      newRecipe.desc = await consol.edit(recipe.desc);
      console.log('Recipe method:');
      newRecipe.method = await consol.edit(recipe.method);
      console.log('Recipe ingredients: (separated by commas)');
      newRecipe.ingredients = await consol.edit(recipe.ingredients.join(', '));
      newRecipe.ingredients = preparationIngredients(newRecipe.ingredients.split(','));
      controller.updateRecipe(newRecipe);
      consol.close();
      changeCategory();
      this.render();
    } else {
      receiver.error('Choose recipe');
    }
  },

  async add() {
    console.clear();
    console.log(`Add Recipre to category - ${controller.category.name}`);
    consol.init();
    const newRecipe = {};
    newRecipe.category = controller.category.id;
    newRecipe.name = await consol.inputAnswer('Recipe name:');
    newRecipe.desc = await consol.inputAnswer('Recipe description:');
    newRecipe.method = await consol.inputAnswer('Recipe method:');
    newRecipe.ingredients = await consol.inputAnswer('Recipe ingredients: (separated by commas)');
    newRecipe.ingredients = preparationIngredients(newRecipe.ingredients.split(','));
    controller.addRecipe(newRecipe);
    consol.close();
    changeCategory();
    this.render();
  },

  async save() {
    const data = {};
    data.category = controller.category;
    data.recipes = controller.recipes;
    data.ingredients = controller.ingredients;
    console.log('\nSaving...');
    await writeData(options, data);
    receiver.render();
    console.log('Data has been saved');
  },

  close() {
    cursor.state = 'navigate';
    receiver.render();
  },

  async exit() {
    if (controller.isDataChanged()) {
      consol.init();
      const save = await consol.confirm('Save changes?');
      consol.close();
      if (save) {
        await receiver.save();
      }
    }
  },
};

class Invoker {
  constructor(dataController) {
    this._receiver = receiver;
    this._receiver.initController(dataController);
    this.init = {
      execute: () => this._receiver.init(this),
      description: '',
      printable: false,
    };
    this.help = {
      execute: () => this._receiver.help(this),
      description: 'help',
      printable: true,
    };
    this.enter = {
      execute: () => this._receiver.enter(),
      description: '',
      printable: false,
    };
    this.error = {
      execute: (msg) => this._receiver.error(msg),
      description: '',
      printable: false,
    };
    this.moveDown = {
      execute: () => this._receiver.moveDown(),
      description: '',
      printable: false,
    };
    this.moveUp = {
      execute: () => this._receiver.moveUp(),
      description: '',
      printable: false,
    };
    this.close = {
      execute: () => this._receiver.close(),
      description: 'or Esc - Close view',
      printable: true,
    };
    this.edit = {
      execute: () => this._receiver.edit(),
      description: 'Edit recipe',
      printable: true,
    };
    this.add = {
      execute: () => this._receiver.add(),
      description: 'Add recipe',
      printable: true,
    };
    this.del = {
      execute: () => this._receiver.del(),
      description: 'Delete recipe',
      printable: true,
    };
    this.save = {
      execute: () => this._receiver.save(),
      description: 'Save changes',
      printable: true,
    };
    this.exit = {
      execute: () => this._receiver.exit(),
      description: 'Get out',
      printable: true,
    };
  }
}

module.exports = Invoker;
