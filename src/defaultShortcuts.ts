import { Shortcuts } from './types'

const defaultShortcuts = [
  {
    name: 'Test',
    command: 'echo "Hello World"',
    description: 'Basic test',
    count: 0,
  },
  {
    name: 'Start',
    command: 'yarn start',
    description: '',
    count: 0,
  },
] as Shortcuts

export default defaultShortcuts
