const inquirer = require('inquirer')
const inquirerAutocomplete = require('inquirer-autocomplete-prompt')
const chalk = require('chalk')
const fuzzy = require('fuzzy')
const orderBy = require('lodash/orderBy')
const partition = require('lodash/partition')

const store = require('../store')

module.exports = (message, onAnswer) => {
  inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

  const getsearchString = ({ name, command, description }) =>
    `${name} | ${
      description ? chalk.italic(description) + ' | ' : ''
    }${chalk.dim(command)}`

  const fuzziOptions = {
    extract: getsearchString,
  }

  getDisplayResult = (nameLength, descriptionLength) => ({
    original: { name = '', description = '', command, ...result },
    score,
  }) => {
    const parsedName = name.padEnd(nameLength)
    const parsedDescription = chalk.italic(
      description.padEnd(descriptionLength)
    )
    const totalLength = [parsedName, parsedDescription, command].join(' | ')
      .length

    const parsedCommand = chalk.dim(
      totalLength > process.stdout.columns
        ? `${command.slice(
            0,
            command.length - (totalLength - process.stdout.columns)
          )}...`
        : command
    )

    return {
      ...result,
      name: [parsedName, parsedDescription, parsedCommand].join(' | '),
      value: command,
      score,
    }
  }

  const formatResults = results => {
    const { nameLength, descriptionLength } = results.reduce(
      (acc, { original: { name = '', description = '' } }) => ({
        nameLength: Math.max(acc.nameLength, name.length),
        descriptionLength: Math.max(acc.descriptionLength, description.length),
      }),
      {
        nameLength: 0,
        descriptionLength: 0,
      }
    )

    return results.map(getDisplayResult(nameLength, descriptionLength))
  }

  const fuzzySearch = (input = '') => {
    const rawResults = fuzzy.filter(input, store.get('shortcuts'), fuzziOptions)
    const results = orderBy(
      formatResults(rawResults),
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
        message,
        source: (_, input) => fuzzySearch(input),
      },
    ])
    .then(({ rawCommand }) => onAnswer(rawCommand))
}
