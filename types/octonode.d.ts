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
