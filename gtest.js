'use srict';

const sourceConsole = require('./sconsole');
const sourceFile = require('./sfile');
const questioner = require('./questioner');
const utils = require('./utils');

async function main() {
  let result;
  // Defaults
  const dataSourceSettings = {
    name: 'file',
    parameters: {
      fileName: 'test.txt',
      currentPath: `${__dirname}\\`,
    },
  };
  const userSource = sourceConsole;

  userSource.init();

  // Set source settings
  dataSourceSettings.parameters = await questioner.settings(dataSourceSettings.name,
    userSource, dataSourceSettings);

  // Get data
  const dataSource = sourceFile;
  const filePath = dataSourceSettings.parameters.currentPath
    + dataSourceSettings.parameters.fileName;
  const inData = await dataSource.read(filePath);

  // Get command
  const command = await questioner.command(userSource, utils.commands);

  if (command) result = utils.commands[command[0]].execute(inData, command[1]);
  userSource.print('\n==========  Result  ==============\n');
  userSource.print(result);

  userSource.close();
}
main();
