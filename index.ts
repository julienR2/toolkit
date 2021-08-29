#!/usr/bin/env node

import chalk from 'chalk'

import shortcuts from './src/utils/getShortcuts'
import completion from './src/completion/init'
import parseArgs from './src/utils/parseArgs'

completion()

const { shortcut, params, variables } = parseArgs()

if (shortcuts.hasOwnProperty(shortcut)) {
  shortcuts[shortcut as keyof typeof shortcuts]({
    params: params || [],
    variables,
  })
} else {
  console.log(chalk.magenta('No shortcut found...'))
}
