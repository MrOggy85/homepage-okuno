import { serve } from "./deps.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;

const CONTENT_TYPES: Record<string, string> = {
  "css": "text/css",
  "ico": "image/x-icon",
  "webp": "image/webp",
  "png": "image/png",
  "js": "text/javascript",
};

async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);
  console.log({
    url: req.url,
    pathname: pathname,
    referrer: req.referrer ?? req.headers.get("referer"),
    "user-agent": req.headers.get("user-agent"),
    "accept-language": req.headers.get("accept-language"),
  });

  const pathnameSplit = pathname.split(".");
  const end = pathnameSplit[pathnameSplit.length - 1];

  if (pathname.startsWith("/static") || CONTENT_TYPES[end]) {
    const contentType = CONTENT_TYPES[end];
    const filePath = `${Deno.cwd()}/${pathname}`;
    const file = await Deno.readFile(filePath);
    return new Response(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "max-age=31536000",
      },
    });
  }

  if (pathname === "/robots.txt") {
    const file = await Deno.readFile(`${Deno.cwd()}/static/robots.txt`);
    return new Response(file, {
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  if (pathname === "/favicon.ico") {
    const file = await Deno.readFile(`${Deno.cwd()}/static/favicon.ico`);
    return new Response(file, {
      headers: {
        "content-type": "image/x-icon",
      },
    });
  }
  if (!pathname.endsWith("/")) {
    const url = new URL(req.url);
    return Response.redirect(`${url.href}/`, 307);
  }

  const path = `${Deno.cwd()}${pathname}index.html`;
  const file = await Deno.readFile(path);
  return new Response(file, {
    headers: {
      "content-type": "text/html",
    },
  });
}

console.log("Server started", {
  port: PORT,
  DENO_REGION: Deno.env.get("DENO_REGION"),
});
await serve(handler, { port: PORT });
