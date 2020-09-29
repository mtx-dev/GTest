'use srict';

const interfaceConsole = require('./iconsole');

async function main() {
  const userInterface = interfaceConsole.create();
  /*
const inData = interfaceDatafile();
const outData = interfaceConsole();
const service = serviceBank();

initSettings(inData.settings, userInterface);
const data = inData.readData();
const command = inputCommand(userInterface, service.commands);
const result = service(data, command);
printResult(result, outData); */

  // tests
  userInterface.init();
  const listen = await userInterface.inputAnswer('what?');
  userInterface.print(`answer is - ${listen}`);
  userInterface.close();
}
main();
