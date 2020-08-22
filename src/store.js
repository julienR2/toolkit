const Configstore = require("configstore");

const packageJson = require("../package.json");

const defaultShortcuts = require("./defaultShortcuts");

const defaultStore = {
  shortcuts: defaultShortcuts,
  gist: {
    token: "",
    username: "",
    password: "",
  },
};

module.exports = new Configstore(packageJson.name, defaultStore);
