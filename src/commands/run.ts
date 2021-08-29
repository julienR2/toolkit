import chalk from 'chalk'

import runCommand from '../utils/runCommand'
import shortcutsAutocomplete from '../utils/shortcutsAutocomplete'
import store from '../store'
import { CommandProps, Store } from '../types'

const run = ({ params, variables }: CommandProps) =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.blue('RUN')}`,
    (rawCommand) => {
      const shortcuts = store.get('shortcuts') as Store['shortcuts']
      const newShortcuts = shortcuts.map((shortcut) => {
        if (shortcut.command === rawCommand) {
          return {
            ...shortcut,
            count: (shortcut.count ?? 0) + 1,
          }
        }

        return shortcut
      })

      store.set('shortcuts', newShortcuts)

      return runCommand(rawCommand, { params, variables })
    },
  )

export default run
