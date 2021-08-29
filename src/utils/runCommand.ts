import { spawn } from 'child_process'
import chalk from 'chalk'

import { CommandProps } from '../types'

const variablesRegex = /<(?<var>(?<key>[\s\S]*?)(=(?<value>[\s\S]*?))?)>/gm

const runCommand = (
  rawCommand: string,
  { params, variables }: CommandProps,
) => {
  let missingVariables = [] as string[]

  const command = rawCommand.replace(
    variablesRegex,
    (_, __, key, ___, value) => {
      if (!variables[key] && !value) {
        missingVariables.push(key)
        return ''
      }

      return variables[key] ? `"${variables[key]}"` : value
    },
  )

  if (missingVariables.length) {
    console.log(
      chalk.magenta(
        `Some variables are missing and have been ignored: ${missingVariables.join(
          ', ',
        )}`,
      ),
    )
  }

  console.log(chalk.green(`> ${command}`))

  spawn(command, params, { stdio: 'inherit', shell: true })
}

export default runCommand
