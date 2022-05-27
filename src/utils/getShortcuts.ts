import store from '../store'

import cliCommands from '../commands'
import { CommandProps, Shortcuts, StoredShortcuts, CommandsFn } from '../types'

import runCommand from './runCommand'

export const storedShortcuts = store.get('shortcuts') as StoredShortcuts

export const shortcuts = storedShortcuts.reduce<Shortcuts>(
  (acc, shortcut) => ({
    ...acc,
    [shortcut.name.toLowerCase()]: shortcut,
  }),
  {},
)

export const commands = {
  ...storedShortcuts.reduce<CommandsFn>(
    (acc, { command, name }) => ({
      ...acc,
      [name.toLowerCase()]: (args: CommandProps) => runCommand(command, args),
    }),
    {},
  ),
  ...(cliCommands as CommandsFn),
}
