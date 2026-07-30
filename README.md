# homepage-okuno

Personal homepage — [www.okuno.se](https://www.okuno.se). A small Deno HTTP
server that serves plain HTML pages and static assets. No framework, no build
step, no dependencies.

## Develop

```
deno task dev      # http://localhost:3000, override with PORT
```

## Pages

Each lives in its own directory as an `index.html`:

- `/` — landing page
- `/tips-tricks/`
- `/crypto-web3/`
- `/quotes/`
- `/japanese-numbers/` — small interactive drill

Shared CSS, JS and images are in `static/`.

## Deploy

Deployed to [Deno Deploy](https://console.deno.com). The entrypoint (`main.ts`)
is configured in `deno.json` under `deploy.runtime`.
