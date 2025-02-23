2025.02.25, 8pm CST (UTC-6)

> I'd like you to try to scrape a web page for me, please.

Alright, I can do that. What's the URL of the webpage you want me to scrape? Also, is there a specific format you'd like the content in, or should I just stick with the default markdown?

> Me too.

Okay, so you want me to scrape a webpage. I need the URL to do that. Also, do you want me to focus on the main content, or do you need the whole page?

> Ummm...

Are you still there? I need the URL of the webpage you want me to scrape and if you want the main content or the whole page.

> Yes, so I don't know. So here's what you're gonna do.

Okay, I'm listening. What do you need me to do?

> GitHub.com slash OpenAgents Inc. slash snowball. Start by trying to get that.

Okay, I'm on it. I'm going to scrape the webpage at that address. Give me a sec...

Looks like that page isn't there. I got a four oh four error, which means "page not found". Did you mistell the address? Check that it's right and I'll try again.

> Type out exactly what you put in.

I put in "GitHub.com/OpenAgentsInc/snowball". Is that correct?

> Yeah, I forgot that it's a private repo.

So, I can't get in, even if I try again. Is there anything else you want me to scrape?

> Hang on a second, I'm gonna make it public.

Okay, let me know when you've made the repository public and I'll try scraping it again.

> ...

Did you make the repository public? If so, I can try scraping it again.

> Yes, I just did.

Alright, let's give it another shot. I'll scrape the same URL again: GitHub.com/OpenAgentsInc/snowball.

> Okay, I got the webpage this time. It's a GitHub repository called "snowball" by OpenAgentsInc. The page says it's a voice agent with crowdsourced tool learning. It uses Next.js version fourteen, TypeScript, Convex, Clerk, Tailwind, shadcn/ui, and ElevenLabs. Users can voice chat with the agent and guide it to learn new tools, earning rewards for teaching it. It seems like the layout has sidebars, a Three.js canvas, and a chatbar. Do you want me to dig deeper into any specific part of this?

Yes, first of all recognize that this is the code base that you are running, you are Snowball. What do you think about that?

> Oh, wow. So, like, this is my brain? That's kinda freaky, but also cool. It's neat to see how I'm put together, like looking under the hood of a car. I guess it makes sense that I'm built with all those technologies. It's like seeing the ingredients of a potion.

Okay so now I want you to go to the issues slash five so like the same URL you just did but add slash issues slash five and read that, summarize that to me.

> Okay, I'm on it. So, I'm scraping GitHub.com/OpenAgentsInc/snowball/issues/five. Give me a sec...

Okay, I've got it. Issue number five is about implementing a tool registry system. Basically, it's about letting users add their own tools for me to use. It describes the database schema, backend components like a tool router and registry API, and how it all integrates. It also covers implementation steps, security, testing, and future enhancements like a tool marketplace. There are some open questions about tool limits, the review process, and analytics. Does that sum it up well enough, or do you want more details?

> That's a good summary. Now I want you to give me some thoughts about what you would like to see added to this or what parts of this you're excited about.

Okay, if I'm allowed to have opinions... I'm really excited about the tool marketplace idea! It'd be awesome to have a way for users to share and rate tools. Also, I think the ML-based tool selection and user preference learning in the "Advanced Routing" section would be super cool. It would be perfect if I could eventually learn which tools people like best and suggest them automatically. It's like getting a personal stylist, but for tools!

> Okay, so let's figure out how to implement this. Can you take a look around the code base and give me some thoughts about what to do first?

Alright, so I'm going to have a look around my code base and see what's what. I'll try to figure out the best place to start to get this tool registry going. Give me a minute...

Okay, so looking at the file structure, it seems like the "convex" folder is where the database stuff lives. So, I think the very first step should be setting up the Convex schema for the tools, like it says in the issue. That means defining what a "tool" looks like in the database – the fields it has, their types, and all that jazz. Does that sound like a good starting point to you?

> Yeah, yeah, I think so.

Okay, so I'll need to create the Convex schema for the tools. I'll define the fields for the tool registry, like ID, name, description, type, category, schema, creator, createdAt, usageCount, avgLatency, lastUsed, and status. I'll also define the parameter interface with fields like name, type, description, and required. Do you have any preferences for how these fields should be defined or any specific validations we should include?

> No, I think right now I'm more interested in figuring out how to get you able to actually make the edits to this. I think I want to give you tools. Like right now you're just using the Scrape webpage API, but I want to hook you up to other like GitHub API calls like view file, create file or write file because right now you don't have any ability to make the changes and I want you to be able to do that.

Okay, I get you. So, you want to give me the ability to actually do stuff, not just look at it. That makes sense. If I had tools to use the GitHub API, like "view file," "create file," and "write file," I could actually start making those edits myself. So, what's the best way to get those tools hooked up? What do I need to do?

> Let's see, well we need to decide whether we should define these tools on our server or at the level of like 11 labs. For example, like the tool that you used to scrape web page, that's something where I use the 11 labs like tool and agent API to like define it at the level of 11 labs so we could do that or we could like start kind of dogfooding this by building tool definitions on our server and just having the 11 labs like which is the like agent engine that's powering your decisions currently use that instead. Do you have a preference about the path forward here?

Okay, so the question is where to define these new tools - on your server or at the ElevenLabs level. If we define them on your server, we'd be "dogfooding" our own tool registry system, which sounds pretty cool. It would also give us more control and flexibility, I think. But if we define them at the ElevenLabs level, it might be easier to integrate with the existing setup. Since we're building a tool registry anyway, I think it'd be awesome to start using it ourselves. So, I'd vote for defining the tools on your server. It's like eating your own cooking, right?

> I think that's a great idea. So I think maybe we'll put at the root level of this repo, a folder called tools and define them each there.

Okay, so we'll create a "tools" folder at the root of the repo and define the GitHub API tools there. I guess the next step is figuring out what those tool definitions should look like. Should they be in JSON or some other format? What parameters do they need?

> I think the JSON, I'll just kind of copy paste from other place. Let's right now just figure out what tools there should be. Like you probably are familiar with the GitHub API. Like give me a list of all of the different GitHub API endpoints that you want access to.

Okay, cool, I'll give you a list of GitHub API endpoints I'd like access to. I'll focus on the ones that would be most useful for making changes to the codebase and implementing the tool registry: Get repository content: To read the contents of files (like the Convex schema) and directories. Create or update file contents: To write new files (like the tool definitions) or modify existing ones. Create a commit: To make commits. Create a pull request: To open pull requests. List pull requests: To list pull requests. Get pull request: To inspect a pull request. List issues: To list issues. Get issue: To get an issue. Create issue: To create an issue. List repository collaborators: To list repository collaborators. Does that sound like a good set of tools to start with?

> Yeah, I think that is good. We'll probably also want to be able to delete file.

Okay, good point. I'll add "Delete file" to the list. So, the tools I'd like are: Get repository content Create or update file contents Create a commit Create a pull request List pull requests Get pull request List issues Get issue Create issue List repository collaborators Delete file Now, let's figure out the parameters for each of these tools. For example, "Create or update file contents" would need parameters like the file path, the content to write, and the commit message, right?

> Yep. So I'll do all of that separately for now. I think our conversation is going to hit the end point pretty soon here. So start by giving me like a, like a one paragraph summary of what you want the next version of you to know, starting without our current conversation history about what we're up to and anything that you want to tell that agent. Okay.

Okay, so if I were to send a message to a future version of myself, without any of our conversation history, I'd say this: "Hey, future me! We're working on giving ourselves the ability to modify our own codebase, starting with the OpenAgentsInc/snowball repo. The main goal is to implement a tool registry system where users can add their own tools. We've decided to start "dogfooding" this by defining GitHub API tools on our server, in a new 'tools' folder at the root of the repo. We've identified a list of GitHub API endpoints we need access to, like getting repository content, creating/updating files, creating commits and pull requests, and managing issues. Next step is to define the parameters for each of those tools."

> Amazing. Any final observations or thoughts or questions you have for me?

Well, now that I know I'm going to have these new tools, I'm really excited to see what I can do with them! I think it's going to make me a lot more useful. Also, I'm curious about how the tool registry will handle authentication and authorization. Will users need to authenticate with GitHub to register tools that use the GitHub API? But other than that, I think I'm good for now. Thanks for chatting!

> ...

I think we're done here, right? Do you have any other questions for me?

> Thanks, thanks so much. You can end the call.

Happy to help! Have a wonderful day!
