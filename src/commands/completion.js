const fs = require('fs')
const os = require('os')
const { spawn } = require('child_process')

const completion = () => {
  const toolkitCompletion = fs.readFileSync('./toolkit.completion.sh', 'utf8')

  fs.appendFile(
    `${os.homedir()}/.bash_profile`,
    `\n\n${toolkitCompletion}`,
    function(err) {
      if (err) throw err

      console.log('Completion installed !')
    }
  )
}
module.exports = completion
