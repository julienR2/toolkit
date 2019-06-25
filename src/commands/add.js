const inquirer = require('inquirer')

const store = require('../store')

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
    default: ({ command }) => command.split(' ')[0],
  },
  {
    type: 'input',
    name: 'description',
    message: 'Description',
    default: ({ name }) => `Run ${name}`,
  },
]

const add = args => {
  inquirer.prompt(questions).then(answers => {
    const shortcuts = store.get('shortcuts')

    store.set('shortcuts', [...shortcuts, { ...answers, count: 0 }])
  })
}

module.exports = add
