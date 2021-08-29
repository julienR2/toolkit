const inquirer = require('inquirer')

const store = require('../store')

const add = ({ shortcuts }) => {
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
      validate: (name) =>
        !shortcuts[name.toLowerCase()]
          ? true
          : 'This shortcut name already exists !',
      default: ({ command }) => command.split(' ')[0],
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description',
      default: ({ name }) => `Run ${name}`,
    },
  ]

  inquirer.prompt(questions).then((answers) => {
    const shortcuts = store.get('shortcuts')

    store.set('shortcuts', [...shortcuts, { ...answers, count: 0 }])
  })
}

module.exports = add
