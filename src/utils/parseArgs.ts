import minimist from 'minimist'

import { CommandProps } from '../types'

const parseArgs = () => {
  const {
    _: [shortcut = 'run', ...rawVariables],
    '--': params,
  } = minimist(process.argv.slice(2), { stopEarly: true, '--': true })

  const variables = rawVariables.reduce((acc, variable) => {
    const [key, value] = variable.split('=')

    return { ...acc, [key]: value }
  }, {}) as CommandProps['variables']

  return { shortcut: shortcut.toLowerCase(), params, variables }
}

export default parseArgs
