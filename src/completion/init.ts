import omelette from 'omelette'

import commands from '../utils/getShortcuts'
import { PLUGINS } from '../commands/constants'
import { OmeletteInstance } from '../types'

const completionTree = Object.keys(commands).reduce((acc, key) => {
  if (key !== 'plugins') {
    return { ...acc, [key]: true }
  }

  return { ...acc, plugins: PLUGINS }
}, {})

const initCompletion = () => {
  const compl = omelette('toolkit|tk <command>') as OmeletteInstance

  compl.tree(completionTree).init()

  return compl
}

export default initCompletion
