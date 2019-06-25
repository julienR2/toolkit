#!/usr/bin/env node

const omelette = require('omelette')
const parseArgs = require('minimist')

const store = require('./src/store')
const cliCommands = require('./src/commands')

const { runCommand } = require('./src/utils')

omelette('toolkit|tk <command>').init()

const shortcuts = store.get('shortcuts').reduce(
  (acc, { command, name }) => ({
    ...acc,
    [name.toLowerCase()]: () => runCommand(command),
  }),
  {}
)

const commands = { ...shortcuts, ...cliCommands }

console.log('commands', commands)

completion.on('toolkit|tk', ({ reply }) => {
  reply(['fatih', 'rotimi'])
})

let {
  _: [command = 'run'],
} = parseArgs(process.argv.slice(2))

command = command.toLowerCase()

if (commands[command]) {
  commands[command]()
} else {
  console.log('No command find')
}
