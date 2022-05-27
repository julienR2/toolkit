import add from './add'
import run from './run'
import remove from './remove'
import edit from './edit'
import sync from './sync'
import version from './version'
import completion from './completion'
import plugins from './plugins'

const commands = {
  add,
  run,
  list: run,
  remove,
  edit,
  sync,
  version,
  plugins,
  completion,
}

export default commands
