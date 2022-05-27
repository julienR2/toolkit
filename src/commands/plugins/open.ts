import runCommand from '../../utils/runCommand'

import { PLUGINS_FOLDER } from '../constants'

const open = () => {
  runCommand(`open ${PLUGINS_FOLDER}`)
}

export default open
