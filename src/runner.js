const { stdout } = process;
const { stdin } = process;
const readline = require('readline');

class Runner {
  constructor(commands) {
    this.commands = commands;
    this.input = '';
    this.stdin = stdin;
    this.keys = {
      '\u0004': () => this.keyEnter(),
      '\r': () => this.keyEnter(),
      '\n': () => this.keyEnter(),
      '\u0003': () => this.exit(),
      '\u001b': () => this.close(),
      '\u001b[B': () => this.moveDown(),
      '\u001b[A': () => this.moveUp(),
      '\b': () => this.backspace(),
    };
  }

  async inputCommand() {
    const promise = new Promise((resolve) => {
      this.stdin.on('data', this.cb(resolve));
    });
    return promise;
  }

  cb(resolve) {
    return (key) => {
      if (key in this.keys) {
        const resCommand = this.keys[key]();
        if (resCommand) resolve(resCommand);
      } else this.newChar(key);
    };
  }

  async start() {
    this.stdin.setRawMode(true);
    this.stdin.resume();
    this.stdin.setEncoding('utf-8');
    this.commands.init.execute();
    const c = await this.inputCommand();
    this.exit();
    await this.commands[c].execute();
  }

  keyEnter() {
    stdout.write('\n');
    const command = this.input;
    this.input = '';
    if (command === '') {
      this.commands.enter.execute();
      return false;
    }
    if (command in this.commands) {
      return command;
    }
    this.commands.error.execute('wrong command');
    return false;
  }

  // resume() {
  //   this.stdin.setRawMode(true);
  //   this.stdin.resume();
  //   this.stdin.setEncoding('utf-8');
  //   this.stdin.on('data', this.inputCommand());
  // }

  // inputCommand() {
  //   return (key) => {
  //     if (key in this.keys) this.keys[key]();
  //     else this.newChar(key);
  //   };
  // }

  // async keyEnter() {
  //   stdout.write('\n');
  //   const command = this.input;
  //   this.input = '';
  //   if (command === 'exit') {
  //     this.exit();
  //     return;
  //   }
  //   if (command === '') {
  //     this.commands.enter.execute();
  //     return;
  //   }
  //   if (command in this.commands) {
  //     this.exit();
  //     await this.commands[command].execute();
  //     return;
  //   }
  //   this.commands.error.execute('wrong command');
  // }

  moveDown() {
    this.commands.moveDown.execute();
  }

  moveUp() {
    this.commands.moveUp.execute();
  }

  close() {
    this.commands.close.execute();
  }

  exit() {
    stdin.removeListener('data', this.cb());
    stdin.setRawMode(false);
    stdin.pause();
  }

  newChar(c) {
    this.input += c;
    stdout.write(c);
  }

  backspace() {
    stdout.write('\b ');
    readline.moveCursor(stdout, -1);
    this.input = this.input.slice(0, this.input.length - 1);
  }
}
module.exports = Runner;
