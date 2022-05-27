import chalk from 'chalk'

// Instructions
const completion = () => {
  console.log(`
${chalk.green('### Install Toolkit completion ###')}

${chalk.blue('If you use ZSH')}

echo '. <(toolkit --completion)' >> ~/.zshrc # or ~/.zprofile

${chalk.blue('If you use BASH')}

On macOS, you may need to install bash-completion using brew install bash-completion.

toolkit --completion >> ~/.config/toolkit.completion.sh
echo 'source ~/.config/toolkit.completion.sh' >> ~/.bash_profile

${chalk.blue('If you use FISH')}

echo 'toolkit --completion-fish | source' >> ~/.config/fish/config.fish

${chalk.green('## All set ☑️ ##')}
`)
}

export default completion
