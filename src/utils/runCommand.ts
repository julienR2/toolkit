import { spawnSync, SpawnOptions } from 'child_process'
import chalk from 'chalk'

import { CommandProps } from '../types'

const variablesRegex = /<(?<var>(?<key>[\s\S]*?)(=(?<value>[\s\S]*?))?)>/gm

type runCommandOptions = SpawnOptions & {
  silent?: boolean
}

const runCommand = (
  rawCommand: string,
  props: CommandProps = {},
  { silent, ...options }: runCommandOptions = {},
) => {
  const params = props.params || []
  const variables = props.variables || {}
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

  if (missingVariables.length && !silent) {
    console.log(
      chalk.magenta(
        `Some variables are missing and have been ignored: ${missingVariables.join(
          ', ',
        )}`,
      ),
    )
  }

  if (!silent) {
    console.log(chalk.green(`> ${command} ${params.join(' ')}`))
  }

  return spawnSync(command, params, {
    stdio: 'inherit',
    shell: true,
    ...options,
  })
}

export default runCommand
