import fs from 'fs'
import path from 'path'

import initCompletion from './init'

const completion = initCompletion()
const programFolder = path.join(completion.HOME, `.${completion.program}`)

const completionPath = path.join(programFolder, 'completion.sh')
const initFile = completion.getDefaultShellInitFile()

// Completion bash
if (!fs.existsSync(programFolder)) {
  fs.mkdirSync(programFolder)
}
fs.writeFileSync(completionPath, completion.generateCompletionCode())

// For every shell, write completion block to the init file
fs.appendFileSync(
  initFile,
  `
export PATH="$PATH:$(yarn global bin)"

${completion.getCompletionBlock()}
`,
)

console.log(
  `✨ Completion setup ! Now restart your terminal or run 'source ${initFile}'`,
)

process.exit()
