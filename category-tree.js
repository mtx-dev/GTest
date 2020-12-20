/*
 Category tree
*/

function Node(name, parent = undefined) {
  this.name = name;
  this.parent = parent;
  this.children = [];
}

function bild(categories) {
  const tree = {};

  // bild nodes
  Object.keys(categories).forEach((id) => {
    tree[id] = new Node(categories[id].name, categories[id].prt);
  });

  // bild children
  let parent;
  Object.keys(tree).map((id) => {
    parent = tree[id].parent;
    if (tree[parent]) tree[parent].children.push(id);
  });
  return tree;
}

module.exports = {
  bild,
};
