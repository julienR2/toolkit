const inquirer = require("inquirer");
const github = require("octonode");

const store = require("../store");

const AUTH_TYPES = {
  credential: "👤 Username/Password",
  token: "🔑 Token",
};
const ACTION_TYPES = {
  upload: "⬆️ Upload",
  download: "⬇️ Download (⚠️ Your current shortcuts will be overrided)",
  change_gist: "♻️ Change gist",
};
const NEW_GIST = {
  name: "✨ Create a new Gist",
  value: null,
};
const GIST_NAME = "toolkit_shortcuts.json";

const authenticate = async () => {
  const { token, username } = store.get("gist");

  if (token || username) return Promise.resolve();

  return inquirer
    .prompt([
      {
        type: "list",
        name: "authType",
        message: "How do you want to auhtenticate to github ?",
        choices: [AUTH_TYPES.credential, AUTH_TYPES.token],
      },
    ])
    .then(({ authType }) => {
      let questions = [
        {
          type: "input",
          name: "token",
          message: "Github personal access token (with gist scope)",
        },
      ];

      if (authType === AUTH_TYPES.credential) {
        questions = [
          {
            type: "input",
            name: "username",
            message: "Username",
          },
          {
            type: "input",
            name: "password",
            message: "Password",
          },
        ];
      }

      return inquirer.prompt(questions).then((auth) => store.set("gist", auth));
    });
};

const defineGist = async (gist) => {
  const { gistId } = store.get("gist");

  if (gistId) return gistId;

  const [gists] = await gist.listAsync();

  const files = gists.map((meta) => ({
    name: Object.keys(meta.files)[0],
    value: meta.id,
  }));

  return inquirer
    .prompt([
      {
        type: "list",
        name: "id",
        message: "Choose a git to synch your shortcuts with ?",
        choices: [NEW_GIST, ...files],
      },
    ])
    .then(async ({ id }) => {
      let gistId = id;

      if (!gistId) {
        const [newGist] = await gist.createAsync({
          description: "Toolkit shortcut backup",
          files: {
            [GIST_NAME]: {
              content: "[]",
            },
          },
        });

        gistId = newGist.id;
      }

      store.set("gist", {
        ...store.get("gist"),
        gistId,
      });

      return gistId;
    });
};

const getGists = async () => {
  await authenticate();
  const { token, ...credentials } = store.get("gist");
  const client = github.client(token || credentials);

  try {
    const [, user] = await client.getAsync("/user", {});
    return { user, client };
  } catch (error) {
    console.log("🤷‍♂️ Error while authenticating... Try again !");
    store.set("gist", {});
    return getGists();
  }
};

const sync = async () => {
  const { user, client } = await getGists();

  const gist = client.gist();

  const gistId = await defineGist(gist);
  console.log("gistId", gistId);
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What action to you want to do ?",
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
          await gist.editAsync(gistId, {
            files: {
              [GIST_NAME]: {
                content: JSON.stringify(store.get("shortcuts"), null, 2),
              },
            },
          });
          console.log("You shortcuts have been saved ✨");
        } catch (error) {
          console.log("🤷‍♂️ An error happended !", error);
        }
        return;
      }

      if (action === ACTION_TYPES.change_gist) {
        store.set("gist", {
          ...store.get("gist"),
          gistId: null,
        });

        sync();
        return;
      }

      const [{ files }] = await gist.getAsync(gistId);
      const shorcutFile = files[GIST_NAME];

      if (!shorcutFile) {
        console.log(
          `No shortcuts found 🤷‍♂️ Make sure the file containing the shortcuts is named ${GIST_NAME}`
        );
        return;
      }

      try {
        const shortcuts = JSON.parse(shorcutFile.content);
        if (!shortcuts.length) {
          console.log(`🤷‍♂️ No shortcuts to import`);
          return;
        }

        store.set("shortcuts", shortcuts);
        console.log("You shortcuts have been restored ✨");
      } catch (error) {
        console.log(`🤷‍♂️ Couldn't detect any shortcuts`);
      }
    });
};

module.exports = sync;
