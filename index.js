#!/usr/bin/env node

const chalk = require('chalk')
const shortcuts = require('./src/utils/getShortcuts')
const completion = require('./src/completion/init')
const parseArgs = require('./src/utils/parseArgs')

completion()

const { shortcut, params, variables } = parseArgs()

if (shortcuts[shortcut]) {
  shortcuts[shortcut]({ params, variables, shortcuts })
} else {
  console.log(chalk.magenta('No shortcut found...'))
}
