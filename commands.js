module.exports = [
  {
    name: 'AVD',
    command: 'emulator -avd Nexus_5X_API_28 &',
    description: 'Run Android emulator',
    count: 0,
  },
  {
    name: 'Test',
    command: 'echo "Hello World"',
    description: 'Basic test',
    count: 1,
  },
  {
    name: 'Start',
    command: 'yarn start',
    description: '',
    count: 0,
  },
]
