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
    this.changed = true;
  }

  update(id, element) {
    this.data[id] = element;
    this.changed = true;
  }

  delete(id) {
    if (id in this.data) {
      delete this.data[id];
      this.changed = true;
      return true;
    }
    throw new Error('ID does not exist');
  }
}

module.exports = Repository;
