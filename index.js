#!/usr/bin/env node

const parseArgs = require('minimist')
const shortcuts = require('./src/utils/getShortcuts')
const completion = require('./src/completion/init')

const variablesRegex = /<(?<var>(?<key>[\s\S]*?)=(?<value>[\s\S]*?))>/gm

completion()

let {
  _: [shortcut = 'run', ...args],
} = parseArgs(process.argv.slice(2), { stopEarly: true })

shortcut = shortcut.toLowerCase()

if (shortcuts[shortcut]) {
  console.log('args', args)

  shortcuts[shortcut](args, shortcuts)
} else {
  console.log('No shortcut found')
}
