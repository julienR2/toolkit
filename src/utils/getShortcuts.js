const store = require('../store')
const cliCommands = require('../commands')

const runCommand = require('./runCommand')

module.exports = {
  ...store.get('shortcuts').reduce(
    (acc, { command, name }) => ({
      ...acc,
      [name.toLowerCase()]: (args) => runCommand(command, args),
    }),
    {},
  ),
  ...cliCommands,
}
