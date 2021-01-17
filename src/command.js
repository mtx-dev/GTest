/* eslint-disable no-underscore-dangle */
const consol = require('./sconsole2');
const Presenter = require('./presenter');
const Cursor = require('./cursor');

let cursor = {};
let controller = {};
let list = {};
let helpCommands = '';
let blockMove = false;
const pesenter = new Presenter();

function isCategory() {
  if (cursor.type() === 'category') {
    return true;
  }
  return false;
}

function isRecipe() {
  if (cursor.type() === 'recipe') {
    return true;
  }
  return false;
}

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
    receiver.renderCategory();
  },

  renderCategory() {
    console.clear();
    console.log(pesenter.listToSrting(list, cursor.position));
    console.log(helpCommands);
  },

  renderRecipe() {
    console.clear();
    console.log(pesenter.recipeToString(controller.getRecipeById(cursor.id())));
    console.log(helpCommands);
  },

  enter() {
    if (isCategory()) {
      controller.category.id = cursor.id();
      changeCategory();
      receiver.renderCategory();
    }
    if (isRecipe()) {
      blockMove = true;
      receiver.renderRecipe();
    }
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
    console.log(`Error: ${text}`); 
  },

  moveDown() {
    if (!blockMove) {
      cursor.down();
      receiver.renderCategory();
    }
  },

  moveUp() {
    if (!blockMove) {
      cursor.up();
      receiver.renderCategory();
    }
  },
  del() { console.log('help'); },
  edit() { console.log('help'); },

  async add() {
    consol.init();
    const a = await consol.inputAnswer('??');
    console.log(`====${a}`);
    consol.close();
  },
  
  close() {
    blockMove = false;
    receiver.renderCategory();
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
    this.del = {
      execute: () => this._receiver.del(),
      description: 'Delete recipe',
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
  }
}

module.exports = Invoker;
