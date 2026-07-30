const PORT = Number(Deno.env.get("PORT")) || 3000;

// Deploy runs the app from a different cwd than the source root, so resolve
// files relative to this module instead of Deno.cwd().
const ROOT = import.meta.dirname;

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

  if (pathname === "/robots.txt") {
    const file = await Deno.readFile(`${ROOT}/static/robots.txt`);
    return new Response(file, {
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  if (pathname === "/favicon.ico") {
    const file = await Deno.readFile(`${ROOT}/static/favicon.ico`);
    return new Response(file, {
      headers: {
        "content-type": "image/x-icon",
      },
    });
  }

  if (pathname.startsWith("/static") || CONTENT_TYPES[end]) {
    const contentType = CONTENT_TYPES[end];
    const filePath = `${ROOT}${pathname}`;
    const file = await Deno.readFile(filePath);
    return new Response(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "max-age=31536000",
      },
    });
  }
  if (!pathname.endsWith("/")) {
    const url = new URL(req.url);
    return Response.redirect(`${url.href}/`, 307);
  }

  const path = `${ROOT}${pathname}index.html`;
  const file = await Deno.readFile(path);
  return new Response(file, {
    headers: {
      "content-type": "text/html",
    },
  });
}

Deno.serve({
  port: PORT,
  onListen: ({ port, hostname }) => {
    console.log("Server started", {
      hostname,
      port,
      DENO_REGION: Deno.env.get("DENO_REGION"),
    });
  },
}, handler);
