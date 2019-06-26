const chalk = require('chalk')

const runCommand = require('../utils/runCommand')
const setupAutocomplete = require('../utils/setupAutocomplete')
const store = require('../store')

const run = args =>
  setupAutocomplete(
    `Which shortcut do you want to ${chalk.underline.blue('RUN')}`,
    rawCommand => {
      const shortcuts = store.get('shortcuts')
      const newShortcuts = shortcuts.map(shortcut => {
        if (shortcut.command === rawCommand) {
          return {
            ...shortcut,
            count: shortcut.count + 1,
          }
        }

        return shortcut
      })

      store.set('shortcuts', newShortcuts)

      return runCommand(rawCommand, args)
    }
  )

module.exports = run
