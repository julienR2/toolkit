const fs = require('fs')
const path = require('path')

const getCompletion = require('./init')

removeSubstring = function (haystack, needle) {
  return haystack.replace(
    new RegExp(
      needle.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'),
      'g',
    ),
    '',
  )
}

const completion = getCompletion()
const initFile = completion.getDefaultShellInitFile()

// For every shell, rewrite the init file
if (fs.existsSync(initFile)) {
  const cleanedInitFile = removeSubstring(
    fs.readFileSync(initFile, 'utf8'),
    completion.getCompletionBlock(),
  )
  fs.writeFileSync(initFile, cleanedInitFile)
}

const programFolder = path.join(completion.HOME, `.${completion.program}`)
const completionPath = path.join(programFolder, 'completion.sh')

// Special treatment for bash to handle extra folder
if (fs.existsSync(completionPath)) {
  fs.unlinkSync(completionPath)
}
if (
  fs.existsSync(programFolder) &&
  fs.readdirSync(programFolder).length === 0
) {
  fs.rmdirSync(programFolder)
}

console.log(`✨ Completion cleaned ! Restart your terminal to finish`)

return process.exit()
