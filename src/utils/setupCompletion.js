const omelette = require('omelette')
const map = require('lodash/map')

const commands = require('./getShortcuts')

module.exports = () => {
  const compl = omelette('toolkit|tk <command>')

  compl.on('command', ({ reply }) => reply(map(commands, (fn, key) => key)))

  compl.init()
}
