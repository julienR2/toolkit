import { Instance } from 'omelette'

export type Shortcut = {
  name: string
  command: string
  description: string
  count?: number
}

export type Shortcuts = Shortcut[]

export type CommandProps = {
  variables?: { [key: string]: string }
  params?: string[]
}
export type CommandFn = (props?: CommandProps) => void
export type CommandsFn = { [key: string]: (props: CommandProps) => void }

export type Store = {
  shortcuts: Shortcut[]
  gist: {
    gistId: string
    token: string
    username: string
    password: string
  }
}

export interface OmeletteInstance extends Instance {
  HOME: string
  program: string
  getDefaultShellInitFile: () => string
  generateCompletionCode: () => string
  getCompletionBlock: () => string
}
