const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const runCommand = require('../../utils/runCommand')

const { PLUGINS_FOLDER } = require('../constants')

const fileShebangMapping = {
  js: '#!/usr/bin/env node',
  py: '#!/usr/bin/env python3',
  custom: '',
}

const createPlugin = ({ fileName, shebang }) => {
  const pluginPath = path.join(PLUGINS_FOLDER, fileName)

  fs.writeFileSync(pluginPath, shebang + '\n')
  fs.chmodSync(pluginPath, '755')
  console.log(`✨ Your plugin has been created !\nOpening ${pluginPath}`)

  return runCommand('open', [pluginPath])
}

const getShebang = (fileName) => {
  const fragments = fileName.split('.')
  const extension = fragments[fragments.length - 1]
  const shebang = fileShebangMapping[extension]

  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'shebang',
        message: 'Enter the shebang to execute the file',
        default: shebang,
      },
    ])
    .then(({ shebang }) => ({
      fileName,
      shebang,
    }))
}

const add = (args) =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'fileName',
        message: 'Enter file name with its extension',
        default: `foo-${Date.now()}.js`,
      },
    ])
    .then(({ fileName }) => {
      const pluginPath = path.join(PLUGINS_FOLDER, fileName)

      if (!fs.existsSync(pluginPath)) {
        return Promise.resolve(fileName)
      }

      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'choice',
            message: '🙅‍♂️ A plugin with this name already exists !',
            choices: [
              { name: 'Change file name', value: 'change' },
              { name: 'Open the file', value: 'open' },
            ],
          },
        ])
        .then(({ choice }) => {
          if (choice === 'change') {
            return add(args)
          }

          console.log(`Opening ${pluginPath}`)
          runCommand('open', [pluginPath])
          return process.exit()
        })
    })
    .then(getShebang)
    .then(createPlugin)

module.exports = add
