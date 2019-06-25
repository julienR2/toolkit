const inquirer = require('inquirer')
const inquirerAutocomplete = require('inquirer-autocomplete-prompt')
const chalk = require('chalk')
const fuzzy = require('fuzzy')
const orderBy = require('lodash/orderBy')
const partition = require('lodash/partition')

const { runCommand } = require('../utils')

const store = require('../store')

const run = () => {
  inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

  const getsearchString = ({ name, command, description }) =>
    `${name} | ${
      description ? chalk.italic(description) + ' | ' : ''
    }${chalk.dim(command)}`

  const fuzziOptions = {
    extract: getsearchString,
  }

  const formatResults = ({ original: result, score }) => ({
    ...result,
    name: getsearchString(result),
    value: result.command,
    score,
  })

  const fuzzySearch = (input = '') => {
    const rawResults = fuzzy.filter(input, store.get('shortcuts'), fuzziOptions)
    const results = orderBy(
      rawResults.map(formatResults),
      ['score', 'count'],
      ['desc', 'desc']
    )

    return Promise.resolve(results)
  }

  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'rawCommand',
        message: 'Which command do you want to run',
        source: (_, input) => fuzzySearch(input),
      },
    ])
    .then(({ rawCommand }) => {
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

      return runCommand(rawCommand)
    })
}

module.exports = run
