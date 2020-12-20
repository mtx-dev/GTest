/*
 Data Service
*/
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const base = {};
const options = {
  catg: `${__dirname}\\${process.env.DATA_CATEGORY}`,
  recipes: `${__dirname}\\${process.env.DATA_RECIPES}`,
  ings: `${__dirname}\\${process.env.DATA_INGRIDIENTS}`, // ingridiets
  recIngs: `${__dirname}\\${process.env.INDX_RECIPES_INGRIDIENTS}`, // ingridiets index in recipes
};

class RecipesBase {
  constructor(data) {
    this.data = data;
  }

  all(table) {
    return this.data[table];
  }

  read(table, index) {
    return this.data[table][index];
  }

  delete(table, id) {
    if (this.data[table][id]) {
      if (Array.isArray(this.data[table])) this.data[table].splice(id, 1);
      else delete this.data[table][id];
    }
    return false;
  }

  create(table, element, id = undefined) {
    if (Array.isArray(this.data[table])) this.data[table].push(element);
    else if (!Array.isArray(element)) this.data[table][id] = element;
  }

  update(table, element, id) {
    this.data[table][id] = element;
  }

  has(table, id) {
    return id in this.data[table];
  }
}

async function fileRead(fName) {
  const promise = new Promise((resolve) => {
    fs.readFile(fName, 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
  return promise;
}

async function fileWrite(fName, data) {
  const promise = new Promise(() => {
    if (data) {
      fs.writeFile(fName, data, 'utf8', (err) => {
        if (err) throw err;
      });
    }
  });
  return promise;
}

// get base
async function readData() {
  const files = Object.keys(options).map((key) => fileRead(options[key]));

  try {
    // read data files
    const textData = await Promise.all(files);

    // fill base and parsing
    Object.keys(options).forEach((key, index) => {
      base[key] = JSON.parse(textData[index]);
    });
  } catch (error) {
    console.log(error);
  }
  return base;
}

// push base
async function saveData() {
  try {
    const baseJSON = [];

    // serialise  base
    Object.keys(options).forEach((key, index) => {
      baseJSON[index] = JSON.stringify(base[key], null, 2);
    });

    // write data files
    const files = Object.keys(options)
      .map((key, index) => fileWrite(options[key], baseJSON[index]));
    Promise.all(files);
  } catch (error) {
    console.log(error);
  }
}

async function init() {
  const db = await readData();
  return new RecipesBase(db);
}

// async function main() {
//   const db = await readData();
//   const recipes = new RecipesBase(db);

//   console.log(recipes.all('ri'));
//   recipes.update('ri', [888, 888], 14);
//   console.log(recipes.all('ri'));
//   // writeData(b);
// }
// main();

module.exports = {
  init,
  readData,
  saveData,
};
