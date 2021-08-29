import inquirer from 'inquirer'
import inquirerAutocomplete from 'inquirer-autocomplete-prompt'
import chalk from 'chalk'
import fuzzy from 'fuzzy'
import orderBy from 'lodash/orderBy'

import store from '../store'
import { Shortcut } from '../types'

const shortcutsAutocomplete = (
  message: string,
  onAnswer: (command: string) => void,
) => {
  inquirer.registerPrompt('autocomplete', inquirerAutocomplete)

  const getsearchString = ({ name, command, description }: Shortcut) =>
    `${name} | ${
      description ? chalk.italic(description) + ' | ' : ''
    }${chalk.dim(command)}`

  const fuzziOptions = {
    extract: getsearchString,
  }

  const getDisplayResult =
    (nameLength: number, descriptionLength: number) =>
    ({
      original: { name = '', description = '', command = '', ...result },
      score,
    }: fuzzy.FilterResult<Shortcut>) => {
      const parsedName = name.padEnd(nameLength)
      const parsedDescription = chalk.italic(
        description.padEnd(descriptionLength),
      )
      const totalLength = [parsedName, parsedDescription, command].join(
        ' | ',
      ).length

      const parsedCommand = chalk.dim(
        totalLength > process.stdout.columns
          ? `${command.slice(
              0,
              command.length - (totalLength - process.stdout.columns),
            )}...`
          : command,
      )

      return {
        ...result,
        name: [parsedName, parsedDescription, parsedCommand].join(' | '),
        value: command,
        score,
      }
    }

  const formatResults = (results: fuzzy.FilterResult<Shortcut>[]) => {
    const { nameLength, descriptionLength } = results.reduce(
      (acc, { original: { name = '', description = '' } }) => ({
        nameLength: Math.max(acc.nameLength, name.length),
        descriptionLength: Math.max(acc.descriptionLength, description.length),
      }),
      {
        nameLength: 0,
        descriptionLength: 0,
      },
    )

    return results.map(getDisplayResult(nameLength, descriptionLength))
  }

  const fuzzySearch = (input = '') => {
    const rawResults = fuzzy.filter(input, store.get('shortcuts'), fuzziOptions)
    const results = orderBy(
      formatResults(rawResults),
      ['score', 'count'],
      ['desc', 'desc'],
    )

    return Promise.resolve(results)
  }

  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'rawCommand',
        message,
        source: (_: any, input: string) => fuzzySearch(input),
      },
    ])
    .then(({ rawCommand }) => onAnswer(rawCommand))
}

export default shortcutsAutocomplete
