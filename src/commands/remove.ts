import chalk from 'chalk'

import shortcutsAutocomplete from '../utils/shortcutsAutocomplete'
import store from '../store'
import { Store } from '../types'

const remove = () =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.red('REMOVE')}`,
    (rawCommand) => {
      const shortcuts = store.get('shortcuts') as Store['shortcuts']
      const newShortcuts = shortcuts.filter(
        (shortcut) => shortcut.command !== rawCommand,
      )

      store.set('shortcuts', newShortcuts)
    },
  )

export default remove
