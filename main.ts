import { serve } from "./deps.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;

const CONTENT_TYPES: Record<string, string> = {
  "css": "text/css",
  "ico": "image/x-icon",
  "webp": "image/webp",
};

async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);
  console.log("pathname", pathname);
  if (pathname.startsWith("/static")) {
    const pathnameSplit = pathname.split(".");
    const end = pathnameSplit[pathnameSplit.length - 1];
    const contentType = CONTENT_TYPES[end];
    console.log("contentType", contentType);

    const file = await Deno.readFile(`${Deno.cwd()}/${pathname}`);
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

  const file = await Deno.readFile("./index.html");
  return new Response(file, {
    headers: {
      "content-type": "text/html",
    },
  });
}

console.log(`Server is listening on port ${PORT}`);
await serve(handler, { port: PORT });
