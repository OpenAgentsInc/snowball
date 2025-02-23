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

### 7:10pm

Got the agent using both client and server tools via ElevenLabs, with a web scraper via Firecrawl as the first real tool. Took awhile to figure out how to make the agent use the auth token; had to write a custom webhook endpoint to debug the request payload because the ElevenLabs documentation wasn't clear.

### 8:05pm

Had an amazing conversation with Snowball where I guided it to think about its own codebase and brainstorm how to solve [issue #5](https://github.com/OpenAgentsInc/snowball/issues/5), the tool registry. Transcribed [here](docs/conversation01.md)

### 12:21am

The [tool registry](https://github.com/OpenAgentsInc/snowball/issues/5) works for two tools, view_file and view_folder. Notably, this are defined not in ElevenLabs (which presumably has a limit of # of tools per agent) but in our own system, soon database, enabling us to smartly route between even thousands of tools. I had an excellent [conversation #2](docs/conversation02.md) with Snowball in which it traversed multiple files in the GitHub repo and wrote up its first [issue](https://github.com/OpenAgentsInc/snowball/issues/17), which will be the first tool it writes itself. Will continue after some sleep!

### 11:59pm

Phew, got behind on updates. Had to scale down the initial goal of adding crowdsourced tool UI, settling only for building our tool registry in an extensible way on our own server rather than adding a bunch of tools to the ElevenLabs UI. Happily we were able to ship a working demo of Snowball traversing its own codebaes using view_file and view_folder tools tied to the GitHub API (via server tools) while also interacting with the user UI via client tools get_active_repo and show_code which displays any given file contents in a pane next to the user chat. Nowhere near where we hoped to be at the end BUT very happy to validate our core idea and explore avenues for future expansion.
