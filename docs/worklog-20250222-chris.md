### 8:30am

Just set up a fresh repo via the Convex [nextjs-clerk-shadcn template](https://github.com/get-convex/templates/tree/main/template-nextjs-clerk-shadcn).

Bug: The provided setup command `npm create convex@latest -t nextjs-clerk-shadcn` didn't use the template, and a different version `npm create convex@latest snowball -- -t nextjs-clerk-shadcn` installed the [deprecated](https://github.com/get-convex/template-nextjs-clerk-shadcn) version. So had to copy this directly from a clone of the latest templates directory.

I've used Convex and Clerk before. That plus standard NextJS/Vercel/Tailwind/Shad will get us going fastest.

### 9:10am

Configured Convex & Clerk for dev and prod. Deployed to https://snowball.openagents.com and the boilerplate works well in prod.
