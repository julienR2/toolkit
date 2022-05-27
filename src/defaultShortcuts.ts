import { StoredShortcuts } from './types'

const defaultShortcuts: StoredShortcuts = [
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
]

export default defaultShortcuts
