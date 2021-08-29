declare module 'octonode' {
  declare var octonode: octonode.Octonode

  export = octonode
  export as namespace octonode

  declare namespace octonode {
    type Gist = {
      id: string
      files: { [key: string]: any }
    }

    type GistProps = {
      description?: string
      files: { [key: string]: { content: string } }
    }

    interface GistClient {
      getAsync: (id: string) => Promise<[Gist]>
      editAsync: (id: String, gist: GistProps) => Promise<void>
      createAsync: (params: GistProps) => Promise<[Gist]>
      listAsync: () => Promise<[Gist[]]>
    }

    interface Client {
      getAsync: (route: string, options?: any) => Promise<[number]>
      gist: () => GistClient
    }

    interface Octonode {
      client: (token: string | { username: string; password: string }) => Client
    }
  }
}

// declare namespace omelette {
//   interface Omelette {
//     (message: string): Instance
//     (literals: TemplateStringsArray, ...placeholders: TemplateValue[]): Instance
//   }

//   interface Instance {
//     cleanupShellInitFile(): void

//     init(): void
//     next(fn: () => void): void

//     on(action: string, callback: Callback): void
//     on(action: 'complete', callback: CallbackOnComplete): void

//     onAsync(actions: string, callback: CallbackAsync): void

//     setupShellInitFile(initFile?: string): void

//     tree(value: TreeValue): this
//   }

//   type ReplyFn<T> = (value: T) => void

//   interface CallbackValue {
//     before: string
//     fragment: number
//     line: string
//     reply: ReplyFn<Choices>
//   }

//   interface CallbackAsyncValue {
//     before: string
//     fragment: number
//     line: string
//     reply: ReplyFn<Promise<Choices>>
//   }

//   type Callback = (obj: CallbackValue) => void
//   type CallbackOnComplete = (fragment: string, obj: CallbackValue) => void

//   type CallbackAsync = (obj: CallbackAsyncValue) => Promise<void>

//   type Choices = string[]

//   type TemplatePrimativeValue = string | Choices

//   type TemplateValue = TemplatePrimativeValue | Callback

//   interface TreeValue {
//     [key: string]: Choices
//   }
// }
