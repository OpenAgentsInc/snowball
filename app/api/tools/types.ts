export interface Tool {
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      description: string;
      required: boolean;
      type: string;
    }
  };
}

export const availableTools: Tool[] = [
  {
    name: 'view_file',
    description: 'View contents of a file in a GitHub repository',
    parameters: {
      path: {
        description: 'Path to the file',
        required: true,
        type: 'string'
      },
      owner: {
        description: 'Repository owner',
        required: true,
        type: 'string'
      },
      repo: {
        description: 'Repository name',
        required: true,
        type: 'string'
      },
      branch: {
        description: 'Branch name',
        required: true,
        type: 'string'
      }
    }
  },
  {
    name: 'view_folder',
    description: 'View contents of a folder in a GitHub repository',
    parameters: {
      path: {
        description: 'Path to the folder',
        required: true,
        type: 'string'
      },
      owner: {
        description: 'Repository owner',
        required: true,
        type: 'string'
      },
      repo: {
        description: 'Repository name',
        required: true,
        type: 'string'
      },
      branch: {
        description: 'Branch name',
        required: true,
        type: 'string'
      }
    }
  }
];