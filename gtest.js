'use srict';

const sourceConsole = require('./sconsole');
const sourceFile = require('./sfile');
const q = require('./questioner');
// const utils = require('./utils');

async function main() {
  // Defaults
  const sourceList = ['console', 'file', 'db'];
  const dataSourceSettings = {
    name: 'file',
    parametrs: {
      fileName: 'test.txt',
      currentPath: `${__dirname}\\`,
      filePath() { return this.currentPath + this.fileName; },
    },
  };
  const outDataSource = {
    name: 'console',
  };
  const questioner = q.create();
  const userSource = sourceConsole.create();
  userSource.init();

  // Set sorce of data
  dataSourceSettings.name = await questioner.source(sourceList, userSource);

  // Set source settings
  dataSourceSettings.parametrs = await questioner.settings(dataSourceSettings.name, userSource, dataSourceSettings);

  const dataSource = sourceFile.create();
  // const inData = await dataSource.read(dataSourceSettings.parametrs.filePath());
  /* To do
  const command = inputCommand(userSource, utils.commands);
  const result = service(inData, command);
  printResult(result, outDataSource); */

  // tests

  // dataSource.settings = dataSource.init();
  // const listen = await userSource.inputAnswer('what?');

  // console.log(dataSourceSettings.name);

  userSource.close();
}
main();
