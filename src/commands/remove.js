const chalk = require('chalk')

const shortcutsAutocomplete = require('../utils/shortcutsAutocomplete')
const store = require('../store')

const remove = () =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.red('REMOVE')}`,
    (rawCommand) => {
      const shortcuts = store.get('shortcuts')
      const newShortcuts = shortcuts.filter(
        (shortcut) => shortcut.command !== rawCommand,
      )

      store.set('shortcuts', newShortcuts)
    },
  )

module.exports = remove
