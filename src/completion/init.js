const omelette = require('omelette')
const glob = require('glob')

const commands = require('../utils/getShortcuts')
const { PLUGINS } = require('../commands/constants')

const completionTree = Object.keys(commands).reduce((acc, key) => {
  if (key !== 'plugins') {
    return { ...acc, [key]: true }
  }

  return {
    ...acc,
    plugins: PLUGINS,
  }
}, {})

module.exports = () => {
  const compl = omelette('toolkit|tk <command>')

  compl.tree(completionTree).init()

  return compl
}
