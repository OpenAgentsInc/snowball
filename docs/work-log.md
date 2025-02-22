### 8:30am

Just set up a fresh repo via the Convex [nextjs-clerk-shadcn template](https://github.com/get-convex/templates/tree/main/template-nextjs-clerk-shadcn).

Bug: The provided setup command `npm create convex@latest -t nextjs-clerk-shadcn` didn't use the template, and a different version `npm create convex@latest snowball -- -t nextjs-clerk-shadcn` installed the [deprecated](https://github.com/get-convex/template-nextjs-clerk-shadcn) version. So had to copy this directly from a clone of the latest templates directory.

I've used Convex and Clerk before. That plus standard NextJS/Vercel/Tailwind/Shad will get us going fastest.

### 9:10am

Configured Convex & Clerk for dev and prod. Deployed to https://snowball.openagents.com and the boilerplate works well in prod.

### 10:20am

Added sidebar layout with demo cards in [PR #1](https://github.com/OpenAgentsInc/snowball/pull/1). You can see how I'm primarily using code-gen with OpenAgents [here](https://github.com/OpenAgentsInc/snowball/pull/1#issuecomment-2676275168), supplemented occasionally by Cursor agent.

### 11:10am

I set up an initial Snowball agent in the ElevenLabs UI and tested it using their default widget. Now having OpenAgents help me build a custom version based on their Conversational API.

### 12:05pm

Custom conversational UI works great and is deployed to prod.

### 1:05pm

Cloned Kiki's voice via ElevenLabs and connected to the Snowball agent. Brainstormed the 3D canvas and Kiki wrote an art design spec [here](https://github.com/OpenAgentsInc/snowball/blob/ca12d927b3255305f0ff9344d6777c1919078c22/docs/Web%20App%20Design%20Spec.md).
