const db = require('./dataservice');
const tree = require('./category-tree');

class Recipes {
  // catg  recipes ings recIngs
  constructor(data) {
    this.db = data;
    this.categoryTree = [];
    this.bildCatgTree();
  }

  bildCatgTree() {
    this.categoryTree = tree.bild(this.db.all('catg'));
  }

  getCategory(id) {
    return this.categoryTree[id].name;
  }

  getCategoryParent(id) {
    return this.categoryTree[id].parent;
  }

  getCategoryChildren(id) {
    if (!this.categoryTree[id].children.length) return false;
    return this.categoryTree[id].children.map((idCat) => ({
      id: idCat,
      name: this.getCategory(idCat),
    }));
  }

  hasChildren(id) {
    return !!this.categoryTree[id].children.length;
  }

  hasParent(id) {
    return !!this.categoryTree[id].parent;
  }

  // all recipes of category {id name}
  getRecipesOf(id) {
    const allResipes = this.db.all('recipes');
    return Object.keys(allResipes)
      .filter((idRec) => allResipes[idRec].category === id)
      .map((idRec) => ({
        id: idRec,
        name: allResipes[idRec].name,
      }));
  }

  getRecipeById(id) {
    const recipe = this.db.read('recipes', id);
    if (recipe) {
      const res = {};
      res[id] = recipe;
      res[id].ingridients = this.getIngsOf(id);
      return res;
    }
    return false;
  }

  hasRecipe(id) {
    return this.db.has('recipes', id);
  }

  getIngridient(id) {
    if (this.db.read('ings', id)) return this.db.read('ings', id).name;
    return false;
  }

  getByName(table, name) {
    const res = Object.entries(this.db.all(table))
      .find((element) => element[1].name === name);
    if (res) {
      const [id, obj] = res;
      obj.id = +id;
      return obj;
    }
    return false;
  }

  //   hasIngridient(id) {
  //     return this.db.has('ings', id);
  //   }

  getIngsOf(id) {
    const ingridients = [];
    this.db.all('recIngs').forEach((ingIdx) => {
      if (ingIdx[0] === id) {
        ingridients.push(this.getIngridient(ingIdx[1]));
      }
    });
    return ingridients;
  }

  delete() {

  }

  add(rec) {
    const {
      category, name, desc, method, ingridients,
    } = rec;

    const newId = this.getNewId('recipes');
    this.data.recipes.push({
      id: newId,
      category,
      name,
      desc,
      method,
    });
    this.addRecIngridients(newId, ingridients);
  }

  updateRecipe(rec) {
    console.log(this.getRecipeById(5));
    const {
      id, category, name, desc, method, ingridients,
    } = rec;
    if (this.hasRecipe(id)) {
      const updRec = {
        category,
        name,
        desc,
        method,
      };
      this.db.update('recipes', updRec, id);
      this.addRecipeIngs(id, ingridients);
    }
    return false;
  }

  addIngridient(ing) {
    const newId = this.getNewId('ings');
    this.db.create('ings', { name: ing }, newId);
    return newId;
  }

  // add all Ingridients of Recipe to 'Ings' and to Insdexes of ingridients
  addRecipeIngs(idRecipe, ingridients) {
    let idIng;
    ingridients.forEach((newIng) => {
      const ingridient = this.getByName('ings', newIng);
      // new ingridient
      idIng = ingridient ? ingridient.id : this.addIngridient(newIng);
      // add Ingridient indexes for recipe
      this.db.create('recIngs', [idRecipe, idIng]);
    });
  }

  getNewId(table) {
    return Math.max(...Object.keys(this.db.all(table))) + 1;
  }
}

async function main() {
  const recipes = new Recipes(await db.init());
  const rec5 = {
    id: 5,
    category: 2,
    name: 'chilli',
    desc: ' It tastes just as great reheated as it does freshly cooked',
    method: 'Heat the oil ',
    // ingridients: ['cheddar', 'egg', 'potatoes2', 'sugar2'],
    ingridients: ['1', '2', '3', '4'],
  };
  const ingridients = ['cheddar', 'noodle soup', 'potatoes2', 'sugar2'];
  recipes.addRecipeIngs(4, ingridients);
  recipes.updateRecipe(rec5);
  // recipes.bildCatgTree();

  // console.log(recipes.getRecipesOf(3));
}
main();

module.exports = {

};
