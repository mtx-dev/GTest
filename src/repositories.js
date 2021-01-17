/*
 Repo Class
*/

class Repository {
  constructor(data) {
    this.data = data;
    this.changed = false;
  }

  all() {
    return this.data;
  }

  findOne(index) {
    return this.data[index];
  }

  create(id, element) {
    this.data[id] = element;
  }

  update(id, element) {
    this.data[id] = element;
  }

  delete(id) {
    if (id in this.data) {
      delete this.data[id];
      return true;
    }
    throw new Error('ID does not exist');
  }

  // has(table, id) {
  //   return id in this.data[table];
  // }
}

module.exports = Repository;
