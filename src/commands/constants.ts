import path from 'path'
import glob from 'glob'

import store from '../store'

const STORE_FOLDER = store.path.split('/').slice(0, -1).join('/')

export const PLUGINS_FOLDER = path.resolve(path.join(STORE_FOLDER, 'plugins'))

export const PLUGINS = glob
  .sync(`${PLUGINS_FOLDER}/*`)
  .map((pluginPath: string) => {
    const fragments = pluginPath.split('/')
    const name = fragments[fragments.length - 1]
    return name
  })
