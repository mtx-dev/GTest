class RecipeController {
  constructor({ category, recipes, ingredients }) {
    this.category = category;
    this.recipes = recipes;
    this.ingredients = ingredients;
    this.FlagIngridietsWithoutRecipe = true;
  }

  // ====== Universal  ======

  getNewId(table) {
    return Math.max(...Object.keys(this[table].all(table))) + 1;
  }

  isDataChanged() {
    return this.recipes.changed || this.ingredients.changed;
  }

  // ====== Recipes ======

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

  addRecipe(rec) {
    const {
      category, name, desc, method, ingredients,
    } = rec;
    const newId = this.getNewId('recipes');
    const ingredientsIds = this.addIngridiets(ingredients);
    this.recipes.create(newId, {
      category,
      name,
      desc,
      method,
      ingredients: ingredientsIds,
    });
  }

  deleteRecipe(id) {
    const recipe = this.recipes.findOne(id);
    if (recipe) {
      this.deleteIngridientsOfRecipe(id, recipe.ingredients);
      this.recipes.delete(id);
      return true;
    }
    return false;
  }

  updateRecipe(rec) {
    const {
      id, category, name, desc, method, ingredients,
    } = rec;
    const ingredientsIds = this.addIngridiets(ingredients);
    this.recipes.update(id, {
      category,
      name,
      desc,
      method,
      ingredients: ingredientsIds,
    });
  }

  // ====== Ingridients ======

  getIdIngridient(name) {
    const allIngredients = Object.keys(this.ingredients.all());
    const result = allIngredients.find((id) => this.ingredients
      .findOne(id).name.toLowerCase() === name.toLowerCase());
    return Number(result);
  }

  getIngridietsOf(id) {
    const ingredients = this.recipes.findOne(id).ingredients
      .map((ingridient) => this.ingredients.findOne(ingridient).name);
    return ingredients;
  }

  addIngridient(ingridientName) {
    const newId = this.getNewId('ingredients');
    this.ingredients.create(newId, { name: ingridientName });
    return newId;
  }

  addIngridiets(ingridients) {
    let id;
    const resIngridients = [];
    ingridients.forEach((newIng) => {
      id = this.getIdIngridient(newIng) || this.addIngridient(newIng);
      if (!resIngridients.includes(id)) resIngridients.push(id);
    });
    return resIngridients;
  }

  deleteIgridient(id) {
    this.ingredients.delete(id);
  }

  deleteIngridientsOfRecipe(id, ingredientsArray) {
    const cantDelete = new Set();
    const allResipes = this.recipes.all();
    Object.keys(allResipes).filter((recipeId) => recipeId !== id)
      .forEach((recipeId) => {
        ingredientsArray.forEach((ing) => {
          if (allResipes[recipeId].ingredients.includes(ing)) {
            cantDelete.add(ing);
          }
        });
      });
    ingredientsArray.forEach((ing) => {
      if (!cantDelete.has(ing)) {
        this.deleteIgridient(ing);
      }
    });
  }
}

module.exports = RecipeController;
