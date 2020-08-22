const chalk = require("chalk");

const runCommand = require("../utils/runCommand");
const shortcutsAutocomplete = require("../utils/shortcutsAutocomplete");
const store = require("../store");

const run = (args) =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.blue("RUN")}`,
    (rawCommand) => {
      const shortcuts = store.get("shortcuts");
      const newShortcuts = shortcuts.map((shortcut) => {
        if (shortcut.command === rawCommand) {
          return {
            ...shortcut,
            count: shortcut.count + 1,
          };
        }

        return shortcut;
      });

      store.set("shortcuts", newShortcuts);

      return runCommand(rawCommand, args);
    }
  );

module.exports = run;
