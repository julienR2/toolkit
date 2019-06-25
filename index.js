#!/usr/bin/env node

const inquirer = require('inquirer')
const inquirerAutocomplete = require('inquirer-autocomplete-prompt')
const chalk = require('chalk')
const fuzzy = require('fuzzy')
const { spawn } = require('child_process')

const commands = require('./commands')

inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

const getsearchString = ({ name, command, description }) =>
  `${name} | ${description ? chalk.italic(description) + ' | ' : ''}${chalk.dim(
    command
  )}`

const fuzziOptions = {
  extract: getsearchString,
}

const formatResults = ({ original: result }) => ({
  name: getsearchString(result),
  value: result.command,
  description: result.description,
})

const fuzzySearch = (input = '') => {
  const rawResults = fuzzy.filter(input, commands, fuzziOptions)
  const results = rawResults.map(formatResults)

  return Promise.resolve(results)
}

inquirer
  .prompt([
    {
      type: 'autocomplete',
      name: 'rawCommand',
      message: 'Which command do you want to run ?',
      source: (_, input) => fuzzySearch(input),
    },
  ])
  .then(({ rawCommand }) => {
    const [command, ...args] = rawCommand.split(' ')

    return spawn(command, args, { stdio: 'inherit' })
  })
