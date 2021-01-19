const { stdout } = process;
const { stdin } = process;
const readline = require('readline');

class Navigator {
  constructor(commands) {
    this.commands = commands;
    this.input = '';
    this.resulCommand = '';
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

  async start() {
    this.commands.init.execute();
    while (this.resulCommand !== 'exit') {
      this.resulCommand = '';
      this.resulCommand = await this.inputCommand();
      await this.commands[this.resulCommand].execute();
    }
  }

  inputCommand() {
    return new Promise((resolve) => {
      const handleEvent = async (key) => {
        if (key in this.keys) this.keys[key]();
        else this.newChar(key);

        if (this.resulCommand) {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', handleEvent);
          resolve(this.resulCommand);
        }
      };

      this.stdin.setRawMode(true);
      this.stdin.resume();
      this.stdin.setEncoding('utf-8');
      this.stdin.on('data', handleEvent);
    });
  }

  keyEnter() {
    const command = this.input;
    this.input = '';
    if (command === '') {
      this.commands.enter.execute();
      return;
    }
    if (command in this.commands) {
      this.resulCommand = command;
      return;
    }
    this.commands.error.execute('Wrong command');
  }

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
    this.resulCommand = 'exit';
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
module.exports = Navigator;
