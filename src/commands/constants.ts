import path from 'path'
import glob from 'glob'

export const PLUGINS_FOLDER = path.resolve(
  path.join(__dirname, '../..', './plugins'),
)

export const PLUGINS = glob
  .sync(`${PLUGINS_FOLDER}/*`)
  .map((pluginPath: string) => {
    const fragments = pluginPath.split('/')
    const name = fragments[fragments.length - 1]
    return name
  })
