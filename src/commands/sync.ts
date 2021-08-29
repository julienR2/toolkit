import { promises as fs } from 'fs'
import { existsSync } from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import github, { GistClient } from 'octonode'
import glob from 'glob'

import store from '../store'
import { PLUGINS_FOLDER } from './constants'
import chalk from 'chalk'
import { Store } from '../types'

const AUTH_TYPES = {
  credential: '👤 Username/Password',
  token: '🔑 Token',
}
const ACTION_TYPES = {
  upload: '⬆️ Upload',
  download: '⬇️ Download (⚠️ Your current shortcuts will be overrided)',
  change_gist: '♻️ Change gist',
}
const NEW_GIST = {
  name: '✨ Create a new Gist',
  value: null,
}
const GIST_NAME = '@toolkit_backup'
const SHORTCUTS_FILE = 'shortcuts.json'

const authenticate = async () => {
  const { token, username } = store.get('gist') as Store['gist']

  if (token || username) return Promise.resolve()

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'authType',
        message: 'How do you want to auhtenticate to github ?',
        choices: [AUTH_TYPES.credential, AUTH_TYPES.token],
      },
    ])
    .then(({ authType }) => {
      let questions = [
        {
          type: 'input',
          name: 'token',
          message: 'Github personal access token (with gist scope)',
        },
      ]

      if (authType === AUTH_TYPES.credential) {
        questions = [
          {
            type: 'input',
            name: 'username',
            message: 'Username',
          },
          {
            type: 'input',
            name: 'password',
            message: 'Password',
          },
        ]
      }

      return inquirer.prompt(questions).then((auth) => store.set('gist', auth))
    })
}

const defineGist = async (gist: GistClient) => {
  const { gistId } = store.get('gist') as Store['gist']

  if (gistId) return gistId

  const [gists] = await gist.listAsync()

  const files = gists.map((meta) => ({
    name: Object.keys(meta.files)[0],
    value: meta.id,
  }))

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Choose a git to synch your shortcuts with ?',
        choices: [NEW_GIST, ...files],
      },
    ])
    .then(async ({ id }) => {
      let gistId = id

      if (!gistId) {
        try {
          const [newGist] = await gist.createAsync({
            description: 'Toolkit shortcut backup',
            files: {
              [GIST_NAME]: {
                content: 'Toolkit Backup files',
              },
              [SHORTCUTS_FILE]: {
                content: '[]',
              },
            },
          })

          gistId = newGist.id
        } catch (error) {
          gistId = null
          console.error(error)
        }
      }

      store.set('gist', {
        ...store.get('gist'),
        gistId,
      })

      return gistId
    })
}

const getGists = async () => {
  await authenticate()

  const { token, ...credentials } = store.get('gist') as Store['gist']
  const client = github.client(token || credentials)

  try {
    const [status] = await client.getAsync('/user', {})

    if (status !== 200) {
      throw new Error('Error authenticating')
    }

    return client
  } catch (error) {
    console.log('🤷‍♂️ Error while authenticating... Try again !')

    store.set('gist', {})

    getGists()
  }
}

const sync = async () => {
  const client = await getGists()

  if (!client) return

  const gist = client.gist()
  const gistId = await defineGist(gist)

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What action to you want to do ?',
        choices: [
          ACTION_TYPES.upload,
          ACTION_TYPES.download,
          ACTION_TYPES.change_gist,
        ],
      },
    ])
    .then(async ({ action }) => {
      if (action === ACTION_TYPES.upload) {
        try {
          const pluginsList = await glob.sync(`${PLUGINS_FOLDER}/*`)
          const plugins = await Promise.all(
            pluginsList.map(async (pluginPath) => {
              const fragments = pluginPath.split('/')
              const name = fragments[fragments.length - 1]
              const content = await fs.readFile(
                path.join(PLUGINS_FOLDER, name),
                'utf8',
              )

              return { name, content }
            }),
          )

          const gistPlugings = plugins.reduce(
            (acc, { name, content }) =>
              !content ? acc : { ...acc, [name]: { content } },
            {},
          )

          await gist.editAsync(gistId, {
            files: {
              [SHORTCUTS_FILE]: {
                content: JSON.stringify(store.get('shortcuts'), null, 2),
              },
              ...gistPlugings,
            },
          })

          console.log('Your shortcuts and plugins have been saved ✨')
        } catch (error) {
          console.log('🤷‍♂️ An error happended !', error)
        }
        return
      }

      if (action === ACTION_TYPES.change_gist) {
        store.set('gist', {
          ...store.get('gist'),
          gistId: null,
        })

        sync()
        return
      }

      if (action === ACTION_TYPES.download) {
        const [{ files }] = await gist.getAsync(gistId)
        const shortcutsFile = files[SHORTCUTS_FILE]
        const pluginsFiles = Object.keys(files)
          .filter(
            (pluginName) =>
              pluginName !== SHORTCUTS_FILE && pluginName !== GIST_NAME,
          )
          .map((pluginName) => ({
            name: pluginName,
            ...files[pluginName],
          }))

        if (!shortcutsFile && !pluginsFiles.length) {
          console.log(`🤷‍♂️ Nothing to sync here`)
          return
        }

        console.log(`⏳ Restoring shorcuts`)

        let shortcuts = []
        try {
          shortcuts = JSON.parse(shortcutsFile.content)
        } catch (error) {
          console.log(`🤷‍♂️ Couldn't detect any shortcuts`)
        }

        if (!shortcuts.length) {
          console.log(`🤷‍♂️ No shortcuts to import`)
        } else {
          store.set('shortcuts', shortcuts)
          console.log('You shortcuts have been restored ✨')
        }

        console.log(`⏳ Restoring plugins`)

        if (pluginsFiles.length) {
          try {
            if (!existsSync(PLUGINS_FOLDER)) {
              await fs.mkdir(PLUGINS_FOLDER)
            }

            await Promise.all(
              pluginsFiles.map(async ({ name, content }) => {
                const pluginPath = path.join(PLUGINS_FOLDER, name)
                await fs.writeFile(pluginPath, content)
                await fs.chmod(pluginPath, '755')
              }),
            )
          } catch (error) {
            console.error(error)
            console.log(`⚠️ Some plugins might not have been loaded`)
          }
        } else {
          console.log(`🤷‍♂️ No plugins to import`)
        }

        console.log(chalk.green('✨ All done !'))
      }
    })
}

export default sync
