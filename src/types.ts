export type Shortcut = {
  name: string
  command: string
  description: string
  count?: number
}

export type StoredShortcuts = Shortcut[]

export type Shortcuts = {
  [key: string]: Shortcut
}

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
