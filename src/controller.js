class RecipeController {
  constructor({ category, recipes, ingredients }) {
    this.category = category;
    this.recipes = recipes;
    this.ingredients = ingredients;
    this.FlagIngridietsWithoutRecipe = true;
  }

  // ====== Universal  ======

  getNewId(table) {
    return Math.max(...Object.keys(this.db.all(table))) + 1;
  }

  getElementByName(table, name) {
    const res = Object.entries(this.db.all(table))
      .find((element) => element[1].name.toLowerCase() === name.toLowerCase());
    if (res) {
      const [id, obj] = res;
      obj.id = +id;
      return obj;
    }
    return false;
  }

  // ====== Recipes ======
  // all recipes of category {id name}
  getRecipesOfCategogy(id) {
    const allResipes = this.recipes.all();
    return Object.keys(allResipes).filter((idRec) => allResipes[idRec].category === id)
      .map((idRec) => ({
        id: idRec,
        name: allResipes[idRec].name,
        type: 'recipe',
      }));
  }

  getRecipeById(id) {
    const recipe = this.recipes.findOne(id);
    if (recipe) {
      const result = { ...recipe };
      result.id = id;
      result.category = this.category.getNameById(recipe.category);
      result.ingredients = this.getIngridietsOf(id);
      return result;
    }
    return false;
  }

  hasRecipe(id) {
    return this.db.has('recipes', id);
  }

  deleteRecipe(id) {
    const recipe = this.db.read('recipes', id);
    if (recipe) {
      this.db.delete('recipes', id);
      this.deleteIngridientsOfRecipe(id);
      return true;
    }
    return false;
  }

  addRecipe(rec) {
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
    this.addRecipeIngridiets(newId, ingridients);
  }

  updateRecipe(rec) {
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
      this.addRecipeIngridiets(id, ingridients);
    }
    return false;
  }

  // ====== Ingridients ======

  hasRecipeIngridient(idRecipe, name) {
    let ingridient;
    let result = false;
    this.db.all('recipes_ingridients')
      .filter((ingIdx) => ingIdx[0] === idRecipe)
      .forEach((ingIdx) => {
        ingridient = this.getIngridientById(ingIdx[1]).toLowerCase();
        if (ingridient === name.toLowerCase()) result = true;
      });
    return result;
  }

  getIngridientById(id) {
    if (this.db.has('ingridients', id)) {
      return this.db.read('ingridients', id).name;
    }
    return false;
  }

  getIngridietsOf(id) {
    const ingredients = this.recipes.findOne(id).ingredients
      .map((ingridient) => this.ingredients.findOne(ingridient).name);
    return ingredients;
  }

  getRecipesOfIngridiet(idIngridient) {
    return this.db.all('recipes_ingridients')
      .filter((ingIdx) => ingIdx[1] === idIngridient)
      .map((ingIdx) => this.getIngridientById(ingIdx[0]));
  }

  addIngridient(ingridient) {
    const newId = this.getNewId('ingridients');
    this.db.create('ingridients', { name: ingridient }, newId);
    return newId;
  }

  addRecipeIngridiets(idRecipe, ingridients) {
    let id;
    ingridients.forEach((newIng) => {
      if (!this.hasRecipeIngridient(idRecipe, newIng)) {
        const ingridient = this.getElementByName('ingridients', newIng);
        id = ingridient ? ingridient.id : this.addIngridient(newIng);
        // update  Ingridient indexes for recipe
        this.db.create('recipes_ingridients', [idRecipe, id]);
      }
    });
  }

  deleteIngridientsOfRecipe(id) {
    const indexes = [];

    this.db.all('recipes_ingridients')
      .forEach((ing, index) => {
        if (ing[0] === id) indexes.push(index);
      });
    // .forEach((ingIdx) => {
    //   if (!this.FlagIngridietsWithoutRecipe) {
    //     //console.log(ingIdx[1]);
    //     this.deleteIgridient(ingIdx[1]);
    //   }
    //   console.log(ingIdx);
    indexes.forEach((indexToDelete) => {
      this.db.delete('recipes_ingridients', indexToDelete);
    });
    /* if (!this.FlagIngridietsWithoutRecipe) {
      indexes.forEach((indexToDelete) => {
        this.db.all('recipes_ingridients')[indexToDelete]
        this.db.delete('recipes_ingridients', indexToDelete);
      }
    }; */

    // console.log(this.db.all('recipes_ingridients'));
  }

  deleteIgridient(id) {
    if (this.getRecipesOfIngridiet(id).length === 0) {
      this.db.delete('ingridients', id);
    }
  }
}
/*
async function init() {
  // const { category, recipes, ingredients } = await init();
  const con = new RecipeController();
  await con.init();
  consol.init();
  const v = new Presenter();

  const temp = con.category.children;
  temp.push(...con.getRecipesOfCategogy(2));

  // console.log(r.getRecipeById(1));
  // console.log(v.recipeToString(con.getRecipeById(2)));

  // category.id = await consol.chooseItemIdList(category.children, 'title');
  console.log(await consol.chooseItemIdList(temp, 'title'));
  // let list = [{id: category.parent, name: '..'}].concat(category.children);
  // category.id = await consol.chooseItemIdList(list, 'title');
  // list = [{id: category.current, name: '..'}].concat(category.children);
  // category.id = await consol.chooseItemIdList(list, category.id );

  consol.close();

  // console.log(__dirname);
  // const recipes = new RecipeController(await db.init());
  // const rec5 = {
  //   id: 5,
  //   category: 2,
  //   name: 'chilli',
  //   desc: ' It tastes just as great reheated as it does freshly cooked',
  //   method: 'Heat the oil ',
  //   // ingridients: ['cheddar', 'egg', 'potatoes2', 'sugar2'],
  //   ingridients: ['1', '2', '3', '4'],
  // };
  // const ingridients = ['cheddar', 'noodle soup', 'potatoes2', 'sugar2'];
  // recipes.addRecipeIngs(4, ingridients);
  // recipes.updateRecipe(rec5);
  // recipes.bildCatgTree();

  // console.log(recipes.getRecipesOf(3));
}
init();
*/
module.exports = RecipeController;
