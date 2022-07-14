import { serve } from "./deps.ts";

const PORT = Number(Deno.env.get("PORT")) || 3000;

const STATIC_FILES: Record<string, string> = {
  '/static/reset.css': "text/css",
  '/static/main.css': "text/css",
  '/static/favicon.ico': "image/x-icon",
};

async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);
  console.log('pathname', pathname);
  if (pathname.startsWith("/static")) {
    const contentType = STATIC_FILES[pathname];
    console.log('contentType', contentType);

    const file = await Deno.readFile(`${Deno.cwd()}/${pathname}`);
    return new Response(file, {
      headers: {
        "content-type": contentType,
  if (pathname === '/robots.txt') {
    const file = await Deno.readFile(`${Deno.cwd()}/static/robots.txt`);
    return new Response(file, {
      headers: {
        "content-type": 'text/plain',
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
