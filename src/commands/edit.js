const inquirer = require("inquirer");
const chalk = require("chalk");

const shortcutsAutocomplete = require("../utils/shortcutsAutocomplete");
const store = require("../store");

const edit = () =>
  shortcutsAutocomplete(
    `Which shortcut do you want to ${chalk.underline.blue("EDIT")}`,
    (rawCommand) => {
      const shortcuts = store.get("shortcuts");

      const shortcut = shortcuts.find(({ command }) => command === rawCommand);

      const questions = [
        {
          type: "input",
          name: "command",
          message: "Command",
          default: () => shortcut.command,
        },
        {
          type: "input",
          name: "name",
          message: "Name",
          default: () => shortcut.name,
        },
        {
          type: "input",
          name: "description",
          message: "Description",
          default: () => shortcut.description,
        },
      ];

      inquirer.prompt(questions).then((answers) => {
        const newShortcuts = store.get("shortcuts").map((sc) =>
          sc.command === shortcut.command
            ? {
                ...sc,
                ...answers,
              }
            : sc
        );

        store.set("shortcuts", newShortcuts);
      });
    }
  );

module.exports = edit;
