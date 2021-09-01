import cowsay from 'cowsay'
import { parse } from 'shell-quote'
import { SpawnOptions } from 'node:child_process'
import { CommandProps } from '../../types'

import parseArgs from '../parseArgs'
import runCommand from '../runCommand'

const getCommandOutput = (rawCommand: string, fakeArgs: string = '') => {
  const args = (parse(fakeArgs) as string[]) || []

  const { params, variables } = parseArgs(['testCommand', ...args])
  const childProcess = runCommand(
    rawCommand,
    { params, variables },
    { stdio: 'pipe', silent: true },
  )
  // output returns [,result,]
  const [_, result] = String(childProcess.output).split(',')
  // runCommand adds an extra \n in the result
  return result?.slice(0, -1)
}

test('Run simple commands', () => {
  const shortcut = {
    command: 'cowsay Hello World',
    expectedOutput: cowsay.say({ text: 'Hello World' }),
  }

  const output = getCommandOutput(shortcut.command)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands with params', () => {
  const shortcut = {
    command: 'cowsay Hello World',
    args: '-e oO',
    expectedOutput: cowsay.say({ text: 'Hello World', e: 'oO' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands passing variables with default', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: '-- text="It works!"',
    expectedOutput: cowsay.say({ text: 'It works!' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands should split variables correctly', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: '-- text=It works!',
    expectedOutput: cowsay.say({ text: 'It' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands should ignore extra variables', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: '-- text="It works!" foo=bar',
    expectedOutput: cowsay.say({ text: 'It works!' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands should use default variables', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: '',
    expectedOutput: cowsay.say({ text: 'Hello World' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run commands with params and variables', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: '-e oO -- text="It works!"',
    expectedOutput: cowsay.say({ text: 'It works!', e: 'oO' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})

test('Run command trying to pass variables as params', () => {
  const shortcut = {
    command: 'cowsay <text=Hello World>',
    args: 'text="It works!"',
    expectedOutput: cowsay.say({ text: 'Hello World text=It works!' }),
  }

  const output = getCommandOutput(shortcut.command, shortcut.args)

  expect(output).toBe(shortcut.expectedOutput)
})
