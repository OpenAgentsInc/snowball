import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Tool } from '../types';

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

Format parameters according to the tool's schema exactly.`,
    prompt: `Available tools:
${tools.map(t => `- ${t.name}: ${t.description}
  Parameters: ${Object.entries(t.parameters).map(([k,v]) => `${k}: ${v.description} (${v.required ? 'required' : 'optional'})`).join(', ')}`).join('\n')}

User intent: "${intent}"

Select the most appropriate tool and extract parameters from the intent.

Think through this step by step:
1. What is the user trying to do?
2. Which tool best matches this intent?
3. What parameters can be extracted from the intent?
4. How confident are you in this selection?`
  });

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

If validation fails, suggest how the user could rephrase their request.`,
    prompt: `User intent: "${intent}"

Selected tool: ${selectedTool}
Tool definition: ${JSON.stringify(tools.find(t => t.name === selectedTool), null, 2)}
Extracted parameters: ${JSON.stringify(parameters, null, 2)}

Validate this tool selection and parameter extraction.`
  });

  return object;
}