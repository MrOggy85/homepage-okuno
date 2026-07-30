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

// Matched on code rather than instanceof: readFile throws a plain Error for
// EISDIR, so Deno.errors.IsADirectory never matches it.
const MISSING = new Set(["ENOENT", "EISDIR", "ENOTDIR"]);

// Missing files are a 404, not a crash. Anything else still throws.
async function readFile(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code && MISSING.has(code)) return null;
    throw err;
  }
}

function notFound(): Response {
  return new Response("404 Not Found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

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
    const file = await readFile(`${ROOT}/static/robots.txt`);
    if (!file) return notFound();
    return new Response(file, {
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  if (pathname === "/favicon.ico") {
    const file = await readFile(`${ROOT}/static/favicon.ico`);
    if (!file) return notFound();
    return new Response(file, {
      headers: {
        "content-type": "image/x-icon",
      },
    });
  }

  if (pathname.startsWith("/static") || CONTENT_TYPES[end]) {
    const contentType = CONTENT_TYPES[end];
    const filePath = `${ROOT}${pathname}`;
    const file = await readFile(filePath);
    if (!file) return notFound();
    return new Response(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "max-age=31536000",
      },
    });
  }

  // Redirect to the trailing-slash form only if the page actually exists,
  // otherwise an unknown path 404s via a pointless extra round trip.
  const file = await readFile(
    `${ROOT}${pathname.replace(/\/?$/, "/")}index.html`,
  );
  if (!file) return notFound();

  if (!pathname.endsWith("/")) {
    const url = new URL(req.url);
    return Response.redirect(`${url.href}/`, 307);
  }

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
