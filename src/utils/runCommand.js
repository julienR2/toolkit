const { spawn, spawnSync } = require("child_process")

module.exports = (rawCommand, extraArgs = [], { sync = false } = {}) => {
  if (sync) {
    return spawnSync(rawCommand, extraArgs, { stdio: "inherit", shell: true })
  }

  return spawn(rawCommand, extraArgs, { stdio: "inherit", shell: true })
}
