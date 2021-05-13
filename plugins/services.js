#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')
const [_, __, command, service] = process.argv

const DIST = '/lib/systemd/system'
const CURRENT_DIR = process.cwd()

try {
  const testCommand = spawnSync('systemctl', ['-v'], {})

  if (testCommand.error || testCommand.status === 127) {
    console.log(`This system doesn't use 'systemctl' to handle services...`)
    return
  }
} catch (error) {
  console.log(`This system doesn't use 'systemctl' to handle services...`)
  return
}

const services = fs
  .readdirSync(CURRENT_DIR)
  .filter((filePath) => filePath.endsWith('.service'))

switch (command) {
  case 'setup': {
    services.forEach((serviceName) => {
      servicePath = path.join(CURRENT_DIR, serviceName)
      distPath = path.join(DIST, serviceName)
      fs.copyFileSync(servicePath, distPath)
      fs.chmodSync(distPath, 644)
    })

    spawnSync('systemctl', ['daemon-reload'], { stdio: 'inherit', shell: true })

    services.forEach((path) => {
      const name = getNameFromPath(path)
      spawnSync('systemctl', ['enable', name], {
        stdio: 'inherit',
        shell: true,
      })
    })
    break
  }
  case 'start':
  case 'restart':
  case 'stop': {
    spawnSync('systemctl', [command, service], {
      stdio: 'inherit',
      shell: true,
    })
    break
  }
  case 'list': {
    spawnSync('systemctl', ['list-unit-files'], {
      stdio: 'inherit',
      shell: true,
    })
    break
  }
  case 'logs': {
    spawnSync('journalctl', ['-b', '-u', service], {
      stdio: 'inherit',
      shell: true,
    })
    break
  }
  default:
    break
}
