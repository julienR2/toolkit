import minimist from 'minimist'

import { CommandProps } from '../types'

const parseArgs = (args?: string[]) => {
  const {
    _: [shortcut = 'run', ...params],
    '--': rawVariables,
  } = minimist(args || process.argv.slice(2), { stopEarly: true, '--': true })

  const variables =
    rawVariables?.reduce<CommandProps['variables']>((acc, variable) => {
      const [key, value] = variable.split('=')

      return { ...acc, [key]: value }
    }, {}) || {}

  return { shortcut: shortcut.toLowerCase(), params, variables }
}

export default parseArgs
