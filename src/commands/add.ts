import inquirer from 'inquirer'

import shortcuts from '../utils/getShortcuts'
import store from '../store'

const add = () => {
  const questions = [
    {
      type: 'input',
      name: 'command',
      message: 'Command',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Name',
      validate: (name: string) =>
        !shortcuts[name.toLowerCase()]
          ? true
          : 'This shortcut name already exists !',
      default: ({ command }: { command: string }) => command.split(' ')[0],
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description',
      default: ({ name }: { name: string }) => `Run ${name}`,
    },
  ]

  inquirer.prompt(questions).then((answers) => {
    const shortcuts = store.get('shortcuts')

    store.set('shortcuts', [...shortcuts, { ...answers, count: 0 }])
  })
}

export default add
