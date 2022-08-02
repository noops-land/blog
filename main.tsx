/** @jsx h */

import {
  BlogMiddleware,
  BlogState,
  DateStyle,
  Post,
} from "https://deno.land/x/blog@0.4.2/types.d.ts";
import blog, { h } from "https://deno.land/x/blog@0.4.2/blog.tsx";
import { serveDir } from "https://deno.land/std@0.149.0/http/file_server.ts";
import { PostPage } from "https://deno.land/x/blog@0.4.2/components.tsx";
import { gfm } from "https://deno.land/x/blog@0.4.2/deps.ts";

// Needed to get .env variables when testing locally
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) { // No import on Deno Deploy
  await import("https://deno.land/std@0.150.0/dotenv/load.ts");
}

// add supplemental syntax highlighting
import "https://esm.sh/prismjs@1.22.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.22.0/components/prism-go?no-check";

const metadata = {
  title: "noops blog",
  author: "noops.land",
  lang: "en",
  dateStyle: "medium" as DateStyle,
  favicon: undefined,
};


PostPage.call = function<T, _A, R>(_thisArgs: T, ...args: PostPageProps[]) {
  return _PostPage(args[0]) as unknown as R
};

function _PostPage({ post, state }: PostPageProps) {
  const html = gfm.render(post.markdown);
  return (
    <div className={`post ${post.pathname.substring(1)}`}>
      {state.showHeaderOnPostPage && state.header}
      <div class="max-w-screen-sm px-6 pt-8 mx-auto">
        <div class="pb-16">
          <a
            href="/"
            class="inline-flex items-center gap-1 text-sm text-gray-500/80 hover:text-gray-700 transition-colors"
            title="Back to Index Page"
          >
            <svg
              className="inline-block w-5 h-5"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.91675 14.4167L3.08341 10.5833C3.00008 10.5 2.94119 10.4097 2.90675 10.3125C2.87175 10.2153 2.85425 10.1111 2.85425 10C2.85425 9.88889 2.87175 9.78472 2.90675 9.6875C2.94119 9.59028 3.00008 9.5 3.08341 9.41667L6.93758 5.5625C7.09036 5.40972 7.27786 5.33334 7.50008 5.33334C7.7223 5.33334 7.91675 5.41667 8.08341 5.58334C8.23619 5.73611 8.31258 5.93056 8.31258 6.16667C8.31258 6.40278 8.23619 6.59722 8.08341 6.75L5.66675 9.16667H16.6667C16.9029 9.16667 17.1006 9.24639 17.2601 9.40584C17.4201 9.56584 17.5001 9.76389 17.5001 10C17.5001 10.2361 17.4201 10.4339 17.2601 10.5933C17.1006 10.7533 16.9029 10.8333 16.6667 10.8333H5.66675L8.10425 13.2708C8.25703 13.4236 8.33341 13.6111 8.33341 13.8333C8.33341 14.0556 8.25008 14.25 8.08341 14.4167C7.93064 14.5694 7.73619 14.6458 7.50008 14.6458C7.26397 14.6458 7.06953 14.5694 6.91675 14.4167Z"
                fill="currentColor"
              />
            </svg>
            INDEX
          </a>
          <a
            title="Edit or file an issue"
            href={ `https://github.com/noops-land/blog/tree/main/posts${post.pathname}.md` }
            class="pl-3 inline-flex items-center gap-1 text-sm text-gray-500/80 hover:text-gray-700 transition-colors"
          >
            <svg
              className="inline-block w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="15px"
              height="15px"
            >
              <path
                fill="currentColor"
                d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"
              />
            </svg>
            EDIT
          </a>
        </div>
        {post.coverHtml && (
          <div
            class="pb-12"
            dangerouslySetInnerHTML={{ __html: post.coverHtml }}
          />
        )}
        <article>
          <h1 class="text-4xl text-gray-900 dark:text-gray-100 font-bold">
            {post.title}
          </h1>
          <Tags tags={post.tags} />
          <p class="mt-1 text-gray-500">
            {(post.author || state.author) && (
              <span>By {post.author || state.author} at{" "}</span>
            )}
            <PrettyDate
              date={post.publishDate}
              dateStyle={state.dateStyle}
              lang={state.lang}
            />
          </p>
          <div
            class="mt-8 markdown-body"
            data-color-mode={state.theme ?? "auto"}
            data-light-theme="light"
            data-dark-theme="dark"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        {state.section}

        {state.footer || <Footer author={state.author} />}
      </div>
    </div>
  );
}

function Tags({ tags }: { tags?: string[] }) {
  return tags && tags.length > 0
    ? (
      <section class="flex gap-x-2 flex-wrap">
        {tags?.map((tag) => (
          <a class="text-bluegray-500 font-bold" href={`/?tag=${tag}`}>
            #{tag}
          </a>
        ))}
      </section>
    )
    : null;
}

function Footer(props: { author?: string }) {
  return (
    <footer class="mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
      <p class="flex items-center gap-2.5 text-gray-400/800 dark:text-gray-500/800 text-sm">
        <span>
          &copy; {new Date().getFullYear()} {props.author} &middot; Powered by
          {" "}
          <a
            class="inline-flex items-center gap-1 underline hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            href="https://deno.land/x/blog"
          >
            Deno Blog
          </a>
        </span>
        <a
          href="/feed"
          class="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="Atom Feed"
        >
          <IconRssFeed /> RSS
        </a>
      </p>
    </footer>
  );
}

function IconRssFeed() {
  return (
    <svg
      class="inline-block w-4 h-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
      <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg>
  );
}

function PrettyDate(
  { date, dateStyle, lang }: {
    date: Date;
    dateStyle?: DateStyle;
    lang?: string;
  },
) {
  const formatted = date.toLocaleDateString(lang ?? "en-US", { dateStyle });
  return <time dateTime={date.toISOString()}>{formatted}</time>;
}

blog({
  ...metadata,
  header: (
    <header class="w-full h-30 lt-sm:h-80 bg-cover bg-center bg-no-repeat">
      <div class="max-w-screen-sm h-full px-6 mx-auto flex flex-col items-center justify-center">
        <h1 class="mt-3 text-4xl text-gray-900 dark:text-gray-100 font-bold">
          {metadata.title}
        </h1>
      </div>
    </header>
  ),
  footer: (
    <footer class="mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
      <link
        rel="stylesheet"
        href="/static/fonts/fontello/css/cc-fontello.css"
      />
      <p class="flex items-top text-gray-400/800 dark:text-gray-500/800 text-sm">
        <span>
          <a
            class="hover:text-gray-800 dark:hover:text-gray-200"
            rel="license"
            href="https://creativecommons.org/licenses/by/4.0/"
            title="Creative Commons Attribution 4.0 International license"
          >
            <i class="cc-icon-cc m-l-0"></i>
            <i class="cc-icon-cc-by"></i>
          </a>
          Content is licensed under a{" "}
          <a
            class="hover:text-gray-800 dark:hover:text-gray-200"
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="license"
          >
            Creative Commons Attribution 4.0 International license
          </a>. Icons by The Noun Project.
        </span>
        <a
          href="/feed"
          class="inline-flex items-bottom gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="RSS Feed"
        >
          <svg
            class="inline-block w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z">
            </path>
            <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z">
            </path>
          </svg>
          RSS
        </a>
      </p>
    </footer>
  ),
  middlewares: [serveStaticDir()],
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

// To enable browser caching, we have to give an ETag to static files
// since Deno.stat does not provide modification time, access time, or creation time
// https://deno.com/deploy/docs/runtime-fs#denostat
//
// We use the DENO_DEPLOYMENT_ID environment variable for the ETag value
// which is provided by Deno Deploy
// https://deno.com/deploy/docs/projects#environment-variables
function serveStaticDir(): BlogMiddleware {
  return async function (req, ctx) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith("/static/")) {
      if (
        Deno.env.get("DENO_DEPLOYMENT_ID") &&
        req?.headers?.get("if-none-match")?.includes(
          Deno.env.get("DENO_DEPLOYMENT_ID") ?? "",
        )
      ) {
        return new Response(null, { status: 304 });
      }
      const fsRoot = ctx.state.directory;
      const fileResponse: Promise<Response> = serveDir(req, {
        fsRoot,
        showDirListing: false,
        quiet: true,
      });
      fileResponse.then((response) => {
        response.headers.set("ETag", Deno.env.get("DENO_DEPLOYMENT_ID") ?? "");
        response.headers.set(
          "Cache-Control",
          "public, max-age=86400, immutable",
        );
      });
      return fileResponse;
    }
    return await ctx.next();
  };
}

interface PostPageProps {
  state: BlogState;
  post: Post;
}
