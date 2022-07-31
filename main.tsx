/** @jsx h */

import blog, { h } from "https://deno.land/x/blog@0.4.2/blog.tsx";
import { serveDir } from "https://deno.land/std@0.149.0/http/file_server.ts";
import 'https://deno.land/std@0.150.0/dotenv/load.ts';

const metadata = {
  title: "noops notes",
  author: "noops.land",
  lang: "en",
  dateStyle: "long",
  icon: null,
}

blog({
  ...metadata,
  header: <header class="w-full h-30 lt-sm:h-80 bg-cover bg-center bg-no-repeat">
    <div class="max-w-screen-sm h-full px-6 mx-auto flex flex-col items-center justify-center">
      <h1 class="mt-3 text-4xl text-gray-900 dark:text-gray-100 font-bold">{metadata.title}
      </h1>
    </div>
  </header>,
  footer: <footer class="mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
    <link rel="stylesheet" href="/static/fonts/fontello/css/cc-fontello.css" />
    <p class="flex items-top text-gray-400/800 dark:text-gray-500/800 text-sm">
      <span>
        <a rel="license" href="https://creativecommons.org/licenses/by/4.0/" title="Creative Commons Attribution 4.0 International license">
          <i class="cc-icon-cc m-l-0"></i>
          <i class="cc-icon-cc-by"></i>
        </a>
        Content is licensed under a <a class="subfoot" href="https://creativecommons.org/licenses/by/4.0/" rel="license">Creative Commons Attribution 4.0 International license</a>. Icons by The Noun Project.</span>
      <a href="/feed" class="inline-flex items-bottom gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" title="RSS Feed">
        <svg class="inline-block w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"></path>
          <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"></path>
        </svg> RSS
      </a>
    </p>
  </footer>,
  middlewares: [serveStaticDir()]
  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});

// To enable browser caching, we have to give a last-modified date to static files
// since Deno.stat does not provide modification time, access time, or creation time
// https://deno.com/deploy/docs/runtime-fs#denostat

// TODO get the date from deployment
function serveStaticDir() {
  return async function (req: Request, ctx): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith("/static/")
    ) {
      let fsRoot = ctx.state.directory
      const fileResponse: Promise<Response> = serveDir(req, {
        fsRoot,
        showDirListing: false,
        quiet: true
      })
      fileResponse.then(response => {
        response.headers.set("last-modified", Deno.env.get("LAST_MODIFIED"))
        response.headers.set("Cache-Control", "public, max-age=86400, immutable")
      })
      return fileResponse
    }
    return await ctx.next();
  };
}
