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
    ├── llm/                  # LLM-based tool selection
    │   └── groq.ts          # Groq integration for tool selection
    │
    ├── types/               # Tool type definitions
    │   └── index.ts        # Tool interface definitions
    │
    └── utils/               # Shared utilities
        └── github.ts        # GitHub-related utilities
```

## Tool Components

Each tool consists of several parts:

### 1. Tool Definition (TypeScript)

Located in `/app/api/tools/types/index.ts`, defines the tool's interface:

```typescript
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
  }
];
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

### 3. LLM-based Tool Selection

Located in `/app/api/tools/llm/groq.ts`, handles tool selection and parameter extraction:

```typescript
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function selectTool(intent: string, tools: Tool[]) {
  const model = groq('llama-3.3-70b-versatile');
  
  const { object } = await generateObject({
    model,
    schema: z.object({
      tool: z.string(),
      confidence: z.number(),
      parameters: z.record(z.any()),
      reasoning: z.string()
    }),
    system: `You are a tool selection agent. Given a user's intent and available tools, select the most appropriate tool and extract required parameters.`,
    prompt: `Available tools:
${tools.map(t => `- ${t.name}: ${t.description}
  Parameters: ${Object.entries(t.parameters).map(([k,v]) => `${k}: ${v.description}`).join(', ')}`).join('\n')}

User intent: "${intent}"

Select the most appropriate tool and extract parameters from the intent.`
  });

  return object;
}
```

## Adding a New Tool

To add a new tool:

1. Define the tool in `types/index.ts`:
   ```typescript
   export const availableTools: Tool[] = [
     // ... existing tools
     {
       name: 'new_tool',
       description: 'Description of what the tool does',
       parameters: {
         param1: {
           description: 'Description of parameter',
           required: true,
           type: 'string'
         }
       }
     }
   ];
   ```

2. Create the tool handler:
   ```typescript
   // handlers/category/new_tool.ts
   export async function new_tool(params: any) {
     // Validate parameters
     // Implement tool logic
     // Return result
   }
   ```

3. Update the main router:
   ```typescript
   // route/route.ts
   import { new_tool } from '../handlers/category/new_tool';

   const handlers = {
     // ... existing handlers
     new_tool
   };
   ```

4. Add any needed utilities:
   ```typescript
   // utils/category.ts
   export function utilityFunction() {
     // Implementation
   }
   ```

## Security

Tools implement several security measures:

1. **Path Validation**: Checks if requested paths are allowed
2. **Token Validation**: Ensures required tokens are configured
3. **Branch Restrictions**: Limits access to specific branches
4. **Error Handling**: Provides user-friendly error messages
5. **Confidence Thresholds**: Requires high confidence in tool selection

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

1. **Tool Design**
   - Keep tools focused on a single responsibility
   - Provide clear, detailed descriptions
   - Define all parameters with clear descriptions

2. **Error Handling**
   - Validate all required parameters
   - Return user-friendly error messages
   - Log errors for debugging

3. **Security**
   - Always validate access permissions
   - Limit operations to allowed repositories/branches
   - Sanitize all inputs

4. **Documentation**
   - Keep tool definitions up to date
   - Document parameter requirements clearly
   - Include usage examples

5. **Testing**
   - Test with various intent phrasings
   - Test parameter extraction accuracy
   - Test error cases and edge cases
   - Test performance and latency

## Future Improvements

1. **Tool Marketplace**: Allow community-contributed tools
2. **Tool Composition**: Enable chaining multiple tools
3. **Caching**: Cache frequently accessed resources
4. **Rate Limiting**: Implement per-user and per-tool limits
5. **Analytics**: Track tool usage and performance