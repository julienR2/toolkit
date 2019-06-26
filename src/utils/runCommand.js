const { spawn } = require('child_process')

module.exports = (rawCommand, extraArgs = []) =>
  spawn(rawCommand, extraArgs, { stdio: 'inherit', shell: true })
