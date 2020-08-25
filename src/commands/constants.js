const path = require("path")
const glob = require("glob")

const PLUGINS_FOLDER = path.resolve(path.join(__dirname, "../..", "./plugins"))

const PLUGINS = glob.sync(`${PLUGINS_FOLDER}/*`).map((pluginPath) => {
  const fragments = pluginPath.split("/")
  const name = fragments[fragments.length - 1]
  return name
})

module.exports = {
  PLUGINS_FOLDER,
  PLUGINS,
}
