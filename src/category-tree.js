/*
 Category tree
*/
function Node(name, parent = undefined) {
  this.name = name;
  this.parent = parent;
  this.children = [];
}

class Catalog {
  constructor(data) {
    this.tree = {};
    Object.keys(data).forEach((i, indx) => {
      const item = Number(i);
      this.tree[item] = new Node(data[item].name, data[item].prt);
      if (indx === 0) this.current = item;
    });

    let parent;
    Object.keys(this.tree).forEach((i) => {
      parent = this.tree[i].parent;
      if (this.tree[parent]) this.tree[parent].children.push(i);
    });
  }

  get name() {
    return this.tree[this.current].name;
  }

  get children() {
    return this.tree[this.current].children.map((cild) => {
      this.tree[cild].id = +cild;
      this.tree[cild].type = 'category';
      return this.tree[cild];
    });
  }

  get parent() {
    return this.tree[this.current].parent;
  }

  set id(val) {
    this.current = val;
  }

  get id() {
    return this.current;
  }

  getNameById(id) {
    return this.tree[id].name;
  }

  encode() {
    const newData = {};
    Object.keys(this.tree).forEach((i) => {
      const item = Number(i);
      newData[item] = {
        name: this.tree[i].name,
        prt: this.tree[i].parent,
      };
    });
    return newData;
  }
}

module.exports = Catalog;
