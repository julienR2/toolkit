#!/usr/bin/env node

import chalk from 'chalk'

import { commands } from './src/utils/getShortcuts'
import parseArgs from './src/utils/parseArgs'
import initCompletion from './src/utils/initCompletion'

const { shortcut, params, variables } = parseArgs()

initCompletion()

if (commands.hasOwnProperty(shortcut)) {
  commands[shortcut]({ params, variables })
} else {
  console.log(chalk.magenta('No shortcut found...'))
}
