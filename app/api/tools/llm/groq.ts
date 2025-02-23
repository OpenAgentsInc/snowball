import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Tool } from '../types';

// Default values for GitHub tools
const DEFAULTS = {
  owner: 'OpenAgentsInc',
  repo: 'snowball',
  branch: 'main'
};

// Common file mappings
const COMMON_FILES = {
  readme: 'README.md',
  'readme.md': 'README.md',
  'readme.markdown': 'README.md',
  package: 'package.json',
  'package.json': 'package.json',
  license: 'LICENSE',
  'license.md': 'LICENSE',
  'license.txt': 'LICENSE'
};

function normalizeFilePath(path: string): string {
  // Convert to lowercase for matching
  const lower = path.toLowerCase();
  
  // Check common file mappings
  for (const [key, value] of Object.entries(COMMON_FILES)) {
    if (lower === key) {
      return value;
    }
  }

  // If it's a README variant without extension, add .md
  if (lower === 'readme' || lower.startsWith('readme.')) {
    return 'README.md';
  }

  // If it's a package.json variant
  if (lower === 'package' || lower.startsWith('package.')) {
    return 'package.json';
  }

  // If it's a license variant
  if (lower === 'license' || lower.startsWith('license.')) {
    return 'LICENSE';
  }

  return path;
}

export async function selectTool(intent: string, tools: Tool[]) {
  const model = groq('llama-3.3-70b-versatile');
  
  const { object } = await generateObject({
    model,
    schema: z.object({
      tool: z.string(),
      confidence: z.number().min(0).max(1),
      parameters: z.record(z.any()),
      reasoning: z.string()
    }),
    system: `You are a tool selection agent. Given a user's intent and available tools, select the most appropriate tool and extract required parameters.

Your task is to:
1. Understand the user's intent
2. Select the most appropriate tool from the available options
3. Extract required parameters from the intent
4. Provide reasoning for your selection
5. Assign a confidence score (0-1) for your selection

Be conservative with confidence scores:
- 0.9+ = Almost certain this is the right tool and parameters
- 0.7-0.9 = Fairly confident but there might be some ambiguity
- 0.5-0.7 = Understand the intent but unsure if tool/params are right
- <0.5 = High uncertainty or unable to map intent to tools

Format parameters according to the tool's schema exactly.

Special handling for common files:
- README -> README.md
- package.json -> package.json
- LICENSE -> LICENSE

Always include the file extension when specifying a path.`,
    prompt: `Available tools:
${tools.map(t => `- ${t.name}: ${t.description}
  Parameters: ${Object.entries(t.parameters).map(([k,v]) => `${k}: ${v.description} (${v.required ? 'required' : 'optional'})`).join(', ')}`).join('\n')}

User intent: "${intent}"

Select the most appropriate tool and extract parameters from the intent.

Think through this step by step:
1. What is the user trying to do?
2. Which tool best matches this intent?
3. What parameters can be extracted from the intent?
4. How confident are you in this selection?

Note: For GitHub operations, if owner/repo/branch are not specified:
- Default owner: ${DEFAULTS.owner}
- Default repo: ${DEFAULTS.repo}
- Default branch: ${DEFAULTS.branch}

Remember to include file extensions in paths (e.g., README.md, not just README).`
  });

  // Apply defaults and normalize paths for GitHub tools
  if (object.tool.startsWith('view_')) {
    // Apply defaults first
    object.parameters = {
      ...DEFAULTS,
      ...object.parameters
    };

    // Normalize file path if it's a file view
    if (object.tool === 'view_file' && object.parameters.path) {
      object.parameters.path = normalizeFilePath(object.parameters.path);
    }
  }

  return object;
}

export async function validateToolSelection(
  intent: string,
  selectedTool: string,
  parameters: Record<string, any>,
  tools: Tool[]
) {
  const model = groq('llama-3.3-70b-versatile');
  
  const { object } = await generateObject({
    model,
    schema: z.object({
      isValid: z.boolean(),
      missingParameters: z.array(z.string()),
      suggestedPrompt: z.string().optional(),
      reasoning: z.string()
    }),
    system: `You are a tool validation agent. Your job is to verify that a selected tool and parameters match the user's intent and meet all requirements.

Check:
1. Does the selected tool match the user's intent?
2. Are all required parameters present and valid?
3. Do the parameter values make sense for the intent?
4. For files, are proper extensions included (e.g., README.md not README)?

If validation fails, suggest how the user could rephrase their request.

Note: For GitHub operations, these defaults are acceptable:
- Owner: ${DEFAULTS.owner}
- Repo: ${DEFAULTS.repo}
- Branch: ${DEFAULTS.branch}`,
    prompt: `User intent: "${intent}"

Selected tool: ${selectedTool}
Tool definition: ${JSON.stringify(tools.find(t => t.name === selectedTool), null, 2)}
Extracted parameters: ${JSON.stringify(parameters, null, 2)}

Validate this tool selection and parameter extraction.`
  });

  return object;
}