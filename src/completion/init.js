const omelette = require("omelette");
const map = require("lodash/map");

const commands = require("../utils/getShortcuts");

module.exports = () => {
  const compl = omelette("toolkit|tk <command>");

  compl.on("command", ({ reply }) => reply(map(commands, (fn, key) => key)));

  compl.init();

  return compl;
};
