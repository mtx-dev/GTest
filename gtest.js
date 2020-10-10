'use srict';

const sourceConsole = require('./sconsole');
const sourceFile = require('./sfile');
const q = require('./questioner');
const utils = require('./utils');

async function main() {
  let result;
  // Defaults
  const sourceList = ['console', 'file', 'db'];
  const dataSourceSettings = {
    name: 'file',
    parameters: {
      fileName: 'test.txt',
      currentPath: `${__dirname}\\`,
    },
  };
  const outDataSource = {
    name: 'console',
  };
  const questioner = q.create();
  const userSource = sourceConsole.create();
  userSource.init();

  // Set sorce of data
  dataSourceSettings.name = await questioner.source(sourceList, userSource, sourceList[1]);

  // Set source settings
  dataSourceSettings.parameters = await questioner.settings(dataSourceSettings.name,
    userSource, dataSourceSettings);

  const dataSource = sourceFile.create();
  const filePath = dataSourceSettings.parameters.currentPath
    + dataSourceSettings.parameters.fileName;
  const inData = await dataSource.read(filePath);

  const service = utils.create();
  const command = await questioner.command(userSource, service.commands);

  if (command) result = service.commands[command[0]].execute(inData, command[1]);
  userSource.print('\n==========  Result  ==============\n');
  userSource.print(result);

  userSource.close();
}
main();
