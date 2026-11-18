# homepage-okuno

Personal homepage — [www.okuno.se](https://www.okuno.se). A small Deno HTTP
server that serves plain HTML pages and static assets. No framework, no build
step, no dependencies.

## Develop

```
deno task dev      # http://localhost:8000, override with PORT
```

## Pages

Each lives in its own directory as an `index.html`:

- `/` — landing page
- `/japanese-numbers/` — small interactive drill

Shared CSS, JS and images are in `static/`.

## Deploy

Deployed to Cloudflare Workers as static files since 2026-11-18 (`cloudflare/wr deploy`;
see `CLAUDE.md`). Until then it ran on [Deno Deploy](https://console.deno.com). The entrypoint (`main.ts`)
is configured in `deno.json` under `deploy.runtime`.
