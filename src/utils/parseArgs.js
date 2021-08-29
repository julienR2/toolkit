const minimist = require('minimist')

const parseArgs = () => {
  const {
    _: [shortcut = 'run', ...rawVariables],
    '--': params,
  } = minimist(process.argv.slice(2), { stopEarly: true, '--': true })

  const variables = rawVariables.reduce((acc, variable) => {
    const [key, value] = variable.split('=')

    return { ...acc, [key]: value }
  }, {})

  return { shortcut: shortcut.toLowerCase(), params, variables }
}

module.exports = parseArgs
