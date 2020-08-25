const path = require("path")

const runCommand = require("../../utils/runCommand")

const { PLUGINS_FOLDER, PLUGINS } = require("../constants")

const add = require("./add")

const plugins = (args) => {
  const [name, ...extraArgs] = args

  switch (name) {
    case "add":
      add(extraArgs)
      break

    default:
      const plugin = PLUGINS.find((plugin) => plugin === name)

      if (!plugin) {
        console.log(`🤷‍♂️ No plugins found ! Try 'tk plugins plugin-name'`)
        return
      }
      runCommand(path.join(PLUGINS_FOLDER, name), extraArgs)
      break
  }
}

module.exports = plugins
