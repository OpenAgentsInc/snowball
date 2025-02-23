# Snowball Tool System

This document explains how tools are implemented in Snowball, including the directory structure, file organization, and how to add new tools.

## Directory Structure

```
.
├── tools/                      # Tool definitions (JSON)
│   └── github/                 # GitHub-related tools
│       ├── view_file.json     # View file tool definition
│       └── view_folder.json   # View folder tool definition
│
└── app/api/tools/             # Tool implementation
    ├── route/                 # Main router
    │   └── route.ts          # Request handling and routing
    │
    ├── handlers/             # Tool handlers (implementation)
    │   └── github/
    │       ├── view_file.ts  # View file implementation
    │       └── view_folder.ts# View folder implementation
    │
    ├── intents/             # Intent patterns and parameter extraction
    │   └── github.ts        # GitHub-related intent handlers
    │
    └── utils/               # Shared utilities
        └── github.ts        # GitHub-related utilities
```

## Tool Components

Each tool consists of several parts:

### 1. Tool Definition (JSON)

Located in `/tools/{category}/`, defines the tool's interface:

```json
{
  "name": "view_file",
  "description": "View file contents at path",
  "type": "server",
  "category": ["github", "files"],
  "schema": {
    "method": "GET",
    "parameters": [
      {
        "name": "path",
        "type": "string",
        "description": "The path of the file to view",
        "required": true
      },
      // ... other parameters
    ]
  }
}
```

### 2. Tool Handler (TypeScript)

Located in `/app/api/tools/handlers/`, implements the tool's functionality:

```typescript
export async function view_file(params: any) {
  const token = validateGitHubToken();
  const { path: filepath, owner, repo, branch } = params;

  // Validate parameters
  if (!filepath) {
    throw new Error('Please specify which file you want to read');
  }

  // Implementation
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  // Handle response
  return await response.text();
}
```

### 3. Intent Handler (TypeScript)

Located in `/app/api/tools/intents/`, handles natural language understanding:

```typescript
{
  pattern: /read|view|show|get|fetch|what'?s?\\s+in|contents?\\s+of/i,
  tool: 'view_file',
  extractParams: (intent: string, context: any) => {
    // Extract parameters from intent and context
    let filepath = context.path || extractFilePath(intent);
    
    return {
      path: filepath,
      owner: context.owner || 'OpenAgentsInc',
      repo: context.repo || 'snowball',
      branch: context.branch || 'main'
    };
  }
}
```

## Adding a New Tool

To add a new tool:

1. Create the tool definition:
   ```bash
   # Create JSON definition
   touch tools/{category}/{tool_name}.json
   ```

2. Create the tool handler:
   ```bash
   # Create handler implementation
   touch app/api/tools/handlers/{category}/{tool_name}.ts
   ```

3. Add intent patterns:
   ```bash
   # Add to or create intent file
   touch app/api/tools/intents/{category}.ts
   ```

4. Add any needed utilities:
   ```bash
   # Add shared utilities if needed
   touch app/api/tools/utils/{category}.ts
   ```

5. Update the main router:
   ```typescript
   // In app/api/tools/route/route.ts
   import { new_tool } from '../handlers/category/new_tool';

   const handlers = {
     // ... existing handlers
     new_tool
   };
   ```

## Example Usage

Tools can be invoked through natural language:

```typescript
// View a file
"Show me the README.md file"
"What's in package.json"
"View the contents of docs/design-spec.md"

// View a folder
"Show me what's in the docs folder"
"List the contents of components directory"
"View folder app/api"
```

## Security

Tools implement several security measures:

1. **Path Validation**: Checks if requested paths are allowed
2. **Token Validation**: Ensures required tokens are configured
3. **Branch Restrictions**: Limits access to specific branches
4. **Error Handling**: Provides user-friendly error messages

## Error Handling

Tools should handle common errors:

```typescript
try {
  // Tool implementation
} catch (error: any) {
  if (error.message.includes('authentication failed')) {
    throw new Error('Authentication failed. Please check configuration.');
  }
  if (error.message.includes('not found')) {
    throw new Error(`Resource not found: ${resource}`);
  }
  throw error;
}
```

## Best Practices

1. **Modularity**: Keep tools isolated and focused
2. **Error Handling**: Provide clear, user-friendly error messages
3. **Parameter Validation**: Validate all parameters before use
4. **Security**: Always check permissions and validate paths
5. **Documentation**: Keep tool definitions and docs up to date
6. **Testing**: Add tests for new tools and intent patterns

## Future Improvements

1. **Tool Marketplace**: Allow community-contributed tools
2. **Tool Composition**: Enable chaining multiple tools
3. **ML-based Intent Matching**: Improve natural language understanding
4. **Analytics**: Track tool usage and performance
5. **Caching**: Cache frequently accessed resources
6. **Rate Limiting**: Implement per-user and per-tool limits