import path from 'path'

import { CommandProps } from '../../types'
import runCommand from '../../utils/runCommand'

import { PLUGINS_FOLDER, PLUGINS } from '../constants'

import add from './add'
import open from './open'

export const pluginCommands = { add, open }

const plugins = (props: CommandProps) => {
  const [name] = props.params || []

  switch (name) {
    case 'add':
      add(props)
      break

    case 'open':
      open()
      break

    default:
      const plugin = PLUGINS.find((plugin: string) => plugin === name)

      if (!plugin) {
        console.log(`🤷‍♂️ No plugins found ! Try 'tk plugins plugin-name'`)
        return
      }
      runCommand(path.join(PLUGINS_FOLDER, name), props)
      break
  }
}

export default plugins
