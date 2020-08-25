#!/usr/bin/env node

const parseArgs = require("minimist")
const shortcuts = require("./src/utils/getShortcuts")
const completion = require("./src/completion/init")

completion()

let {
  _: [shortcut = "run", ...args],
} = parseArgs(process.argv.slice(2), { stopEarly: true })

shortcut = shortcut.toLowerCase()

if (shortcuts[shortcut]) {
  shortcuts[shortcut](args, shortcuts)
} else {
  console.log("No shortcut found")
}
