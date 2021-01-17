const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgBrBlack: '\x1b[100m',
};

function paint(text, color) {
  return `${colors[color]}${text}${colors.Reset}`;
}

function recipeRowString(data) {
  return `- ${data.name}`;
}

function categoryRowString(data) {
  return `[  ${data.name}  ]`;
}

function paragraph(text = '', maxLength) {
  const str = text.split(' ');
  const result = str.reduce((acc, val) => {
    const row = acc.length - 1;
    if ((acc[row].length + val.length) >= maxLength) {
      acc[row] += '\n';
      acc.push(`${val}`);
    } else acc[row] += ` ${val}`;
    return acc;
  }, ['']);

  return result.join(' ');
}

class Presenter {
  constructor() {
    this.colorType = {
      category: 'FgCyan',
      recipe: 'FgYellow',
      cursor: 'BgCyan',
      command: 'FgBlue',
    };
    this.toRow = {
      recipe: (data) => recipeRowString(data),
      category: (data) => categoryRowString(data),
    };
  }

  listToSrting(list, cursor) {
    return list.reduce((str, value, idx) => {
      let strRender = str;
      let color = this.colorType[list[idx].type];
      if (idx === cursor) color = this.colorType.cursor;
      strRender += paint(this.toRow[list[idx].type](list[idx]), color);
      strRender += '\n';
      return strRender;
    }, '');
  }

  recipeToString(recipe) {
    const result = [];
    result.push(`Category: ${paint(recipe.category, this.colorType.category)}`);
    // result.push(`id: ${recipe.id}`);
    result.push(`Name: ${paint(recipe.name, this.colorType.recipe)}`);
    result.push('\nDecription:');
    result.push(paragraph(recipe.desc, 80));
    result.push('\nMethod:');
    result.push(paragraph(recipe.method, 80));
    result.push('\nIngredients:');
    result.push(` - ${recipe.ingredients.join('\n - ')}`);
    result.push('');
    return result.join('\n');
  }

  commandsToString(commands) {
    let result = '';
    commands.map((com) => {
      result += `${paint(com, this.colorType.command)}  `;
    });
    result += '\n';
    return result;
  }
}

module.exports = Presenter;
