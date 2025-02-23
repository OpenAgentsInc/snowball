# Adding New Tools to Snowball

This guide explains how to add new tools to Snowball's tool registry.

## Overview

Tools in Snowball are implemented in three parts:
1. Intent pattern matching (how to recognize what the user wants)
2. Parameter extraction (how to get the needed details)
3. Tool handler (how to execute the action)

## Step-by-Step Process

### 1. Add Intent Pattern

In `app/api/tools/route/route.ts`, add a new pattern to `intentPatterns`:

```typescript
{
  // Pattern to match in user's request
  pattern: /create.*branch|make.*branch|new branch/i,
  
  // Name of the tool (must match handler name)
  tool: 'create_branch',
  
  // Function to extract parameters from intent and context
  extractParams: (intent: string, context: any) => {
    // Extract parameters from the intent string
    const nameMatch = intent.match(/(?:called|named)\s+([^\s]+)/i);
    
    // Use context values as fallback
    return {
      name: nameMatch?.[1] || context.name,
      owner: context.owner || 'OpenAgentsInc',
      repo: context.repo || 'snowball',
      baseBranch: context.base || 'main'
    };
  }
}
```

### 2. Add Tool Handler

In the same file, add a handler to the `handlers` object:

```typescript
create_branch: async (params: any) => {
  // Validate GitHub token
  const token = validateGitHubToken();
  const { name, owner, repo, baseBranch } = params;

  // Validate required parameters
  if (!name) {
    throw new Error('Please specify what to name the branch');
  }

  // Execute the tool logic
  const response = await fetch(...);

  // Return the result
  return response.json();
}
```

### 3. Update Access Controls

If needed, update `ALLOWED_REPOS` to control access to the new tool:

```typescript
const ALLOWED_REPOS = {
  'OpenAgentsInc/snowball': {
    allowedPaths: [...],
    publicBranches: ['main'],
    allowedOperations: ['view_file', 'create_branch']
  }
};
```

### 4. Update System Prompt

Add examples to the system prompt showing how to use the new tool:

```
You have access to GitHub through natural language requests. Examples:
- "Read the README file" -> {"intent": "read README"}
- "Create a branch called feature/xyz" -> {"intent": "create branch called feature/xyz"}
- "Make a PR for my changes" -> {"intent": "create PR", "context": {"branch": "feature/xyz"}}
```

## Best Practices

1. **Intent Patterns**
   - Make patterns flexible to match various phrasings
   - Include common variations and synonyms
   - Test with different ways users might express the intent

2. **Parameter Extraction**
   - Extract as much as possible from the intent string
   - Use context object as fallback
   - Provide clear error messages when required params are missing

3. **Error Handling**
   - Validate all required parameters
   - Return user-friendly error messages
   - Log errors for debugging

4. **Security**
   - Always validate access permissions
   - Limit operations to allowed repositories/branches
   - Sanitize all inputs

## Example: View File Tool

Here's how the view_file tool is implemented:

```typescript
// Intent Pattern
{
  pattern: /read|view|show|get|fetch|what'?s?\s+in|contents?\s+of/i,
  tool: 'view_file',
  extractParams: (intent: string, context: any) => {
    // Try context first
    let filepath = context.path || context.file || context.filepath;
    
    // Try to extract from intent
    if (!filepath) {
      filepath = extractFilePath(intent);
    }

    return {
      path: filepath,
      owner: context.owner || 'OpenAgentsInc',
      repo: context.repo || 'snowball',
      branch: context.branch || 'main'
    };
  }
}

// Handler
view_file: async (params: any) => {
  const token = validateGitHubToken();
  const { path: filepath, owner, repo, branch } = params;

  if (!filepath) {
    throw new Error('Please specify which file you want to read');
  }
  
  if (!isAllowedPath(owner, repo, filepath, branch)) {
    throw new Error('This file is not publicly accessible');
  }

  // Call GitHub API and return result
  ...
}
```

## Testing New Tools

1. Test the intent pattern with various phrasings
2. Test parameter extraction with and without context
3. Test error cases (missing params, unauthorized access)
4. Test the full flow through the ElevenLabs agent

## Deployment

1. Commit changes to a feature branch
2. Test thoroughly in development
3. Create a pull request
4. After review and testing, merge to main
5. Deploy and verify in production