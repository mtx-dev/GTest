'use srict';

const sourceConsole = require('./sconsole');
const questioner = require('./questioner');
// const utils = require('./utils');

async function main() {
  // Defaults
  const dataSource = {
    name: 'file',
  };
  const outDataSource = {
    name: 'console',
  };
  const userSource = sourceConsole.create();

  // Set sorce of data
  dataSource.name = questioner.source(userSource);

  // Set source settings
  dataSource.settings = questioner(dataSource.name, userSource);

  /* To do
  const inData = dataReader(dataSource);
  const command = inputCommand(userSource, utils.commands);
  const result = service(inData, command);
  printResult(result, outDataSource); */

  // tests
  userSource.init();
  const listen = await userSource.inputAnswer('what?');
  userSource.print(`answer is - ${listen}`);
  userSource.close();
}
main();
