class Cursor {
  constructor(list, position) {
    this.list = list;
    this.position = position || 0;
    this.max = list.length - 1;
  }

  up() {
    this.position--;
    if (this.position < 0) this.position = 0;
  }

  down() {
    this.position++;
    if (this.position > this.max) this.position = this.max;
  }

  id() {
    return this.list[this.position].id;
  }

  type() {
    return this.list[this.position].type;
  }
}

module.exports = Cursor;
