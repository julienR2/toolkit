import Configstore from 'configstore'

import packageJson from '../package.json'

import defaultShortcuts from './defaultShortcuts'
import { Store } from './types'

const defaultStore = {
  shortcuts: defaultShortcuts,
  gist: {
    token: '',
    username: '',
    password: '',
  },
} as Store

const store = new Configstore(packageJson.name, defaultStore)

export default store
