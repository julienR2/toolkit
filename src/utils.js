const { spawn } = require('child_process')

const runCommand = rawCommand => {
  const [command, ...args] = rawCommand.split(' ')
  return spawn(command, args, { stdio: 'inherit' })
}

module.exports = {
  runCommand,
}
