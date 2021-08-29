import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'

import runCommand from '../../utils/runCommand'

import { PLUGINS_FOLDER } from '../constants'
import { CommandProps } from '../../types'

const fileShebangMapping = {
  js: '#!/usr/bin/env node',
  py: '#!/usr/bin/env python3',
  custom: '',
}

const createPlugin = ({
  fileName,
  shebang,
}: {
  fileName: string
  shebang: string
}) => {
  const pluginPath = path.join(PLUGINS_FOLDER, fileName)

  fs.writeFileSync(pluginPath, shebang + '\n')
  fs.chmodSync(pluginPath, '755')
  console.log(`✨ Your plugin has been created !\nOpening ${pluginPath}`)

  return runCommand('open', {
    params: [pluginPath],
    variables: {},
  })
}

const getShebang = (fileName: string) => {
  const fragments = fileName.split('.')
  const extension = fragments[
    fragments.length - 1
  ] as keyof typeof fileShebangMapping
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

const add = (props: CommandProps) => {
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
            return add(props)
          }

          console.log(`Opening ${pluginPath}`)
          runCommand('open', props)
          return process.exit()
        })
    })
    .then(getShebang)
    .then(createPlugin)
}

export default add
