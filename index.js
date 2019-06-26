#!/usr/bin/env node

const parseArgs = require('minimist')
const shortcuts = require('./src/utils/getShortcuts')
const setupCompletion = require('./src/utils/setupCompletion')

setupCompletion()

let {
  _: [shortcut = 'run', ...args],
} = parseArgs(process.argv.slice(2), { stopEarly: true })

shortcut = shortcut.toLowerCase()

if (shortcuts[shortcut]) {
  shortcuts[shortcut](args, shortcuts)
} else {
  console.log('No shortcut find')
}
