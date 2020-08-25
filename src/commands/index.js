const add = require("./add")
const run = require("./run")
const remove = require("./remove")
const edit = require("./edit")
const sync = require("./sync")
const plugins = require("./plugins")

module.exports = {
  add,
  run,
  list: run,
  remove,
  edit,
  sync,
  plugins,
}
