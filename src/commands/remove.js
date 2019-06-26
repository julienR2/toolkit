const chalk = require('chalk')

const runCommand = require('../utils/runCommand')
const setupAutocomplete = require('../utils/setupAutocomplete')
const store = require('../store')

const remove = () =>
  setupAutocomplete(
    `Which shortcut do you want to ${chalk.underline.red('REMOVE')}`,
    rawCommand => {
      const shortcuts = store.get('shortcuts')
      const newShortcuts = shortcuts.filter(
        shortcut => shortcut.command !== rawCommand
      )

      store.set('shortcuts', newShortcuts)
    }
  )

module.exports = remove
