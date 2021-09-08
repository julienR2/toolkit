import inquirer from 'inquirer'
import chalk from 'chalk'

import shortcutsAutocomplete from '../utils/shortcutsAutocomplete'
import store from '../store'
import { Store } from '../types'

const edit = () =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.blue('EDIT')}`,
    (rawCommand) => {
      const shortcuts = store.get('shortcuts') as Store['shortcuts']

      const shortcut = shortcuts.find(({ command }) => command === rawCommand)

      const questions = [
        {
          type: 'input',
          name: 'command',
          message: 'Command',
          default: () => shortcut?.command,
        },
        {
          type: 'input',
          name: 'name',
          message: 'Name',
          default: () => shortcut?.name,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description',
          default: () => shortcut?.description,
        },
      ]

      inquirer.prompt(questions).then((answers) => {
        const newShortcuts = (store.get('shortcuts') as Store['shortcuts']).map(
          (sc) =>
            sc.command === shortcut?.command
              ? {
                  ...sc,
                  ...answers,
                }
              : sc,
        )

        store.set('shortcuts', newShortcuts)
      })
    },
  )

export default edit