import omelette from 'omelette'

import { PLUGINS } from '../commands/constants'
import cliCommands from '../commands'

import { storedShortcuts, shortcuts } from './getShortcuts'
import { variablesRegex } from './runCommand'

function getShortcutParams(name: string) {
  const shortcut = shortcuts[name]

  if (!shortcut) return

  return shortcut.command
    .match(variablesRegex)
    ?.map((param) => param.replaceAll(/(<|>)/g, '').split('=')[0])
}

const initCompletion = () => {
  omelette`
  toolkit|tk
      ${[
        ...Object.keys(cliCommands),
        ...storedShortcuts.map(({ name }) => name),
      ]}
      ${({ before }) => {
        const params = getShortcutParams(before)

        if (!params?.length) return

        return ['--']
      }}
      ${({ line }) => {
        if (!line.includes('--')) return

        const [rawCommand, existingParams] = line.split(' -- ')
        const [_, command] = rawCommand.split(' ')

        const params = getShortcutParams(command)

        return params
          ?.filter((param) => !existingParams.includes(param))
          .map((param) => `${param}=`)
      }}
  `.init()
}

export default initCompletion
