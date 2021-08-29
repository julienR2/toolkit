import store from '../store'
import cliCommands from '../commands'
import { CommandProps, Shortcuts, CommandsFn } from '../types'

import runCommand from './runCommand'

const shortcuts = {
  ...(store.get('shortcuts') as Shortcuts).reduce<CommandsFn>(
    (acc, { command, name }) => ({
      ...acc,
      [name.toLowerCase()]: (args: CommandProps) => runCommand(command, args),
    }),
    {},
  ),
  ...(cliCommands as CommandsFn),
} as CommandsFn

export default shortcuts
