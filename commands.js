module.exports = [
  {
    name: 'AVD',
    command: 'emulator -avd Nexus_5X_API_28 &',
    description: 'Run Android emulator',
  },
  {
    name: 'Test',
    command: 'echo "Hello World"',
    description: 'Basic test',
  },
  {
    name: 'Start',
    command: 'yarn start',
    description: '',
  },
]
