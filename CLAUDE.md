# homepage-okuno

Personal homepage: a small Deno HTTP server (`main.ts`) that serves static HTML
pages and assets. No framework, no build step, no dependencies.

## Layout

- `main.ts` — the whole server. Routing is a chain of `if` checks on `pathname`.
- `index.html` — root page. Each subdirectory (currently just
  `japanese-numbers/`) holds its own `index.html`.
- `static/` — shared CSS, JS, images, `robots.txt`, `favicon.ico`.

Paths without a trailing slash get a 307 redirect to the slash form, which then
resolves to `<dir>/index.html`.

## Run

```
deno task dev      # watch mode on :8000, or set PORT
```

`deno check main.ts` and `deno lint` before committing.

## Deploy (old: Deno Deploy, until 2026-11-18)

Deno Deploy (console.deno.com). Entrypoint is set in `deno.json`
under `deploy.runtime`. Two constraints that are easy to break:

- Use `Deno.serve()`. The std `serve()` is unsupported and fails at warmup.
- Resolve files from `import.meta.dirname`, never `Deno.cwd()` — Deploy runs
  from a different working directory than the source root.

## Conventions

- Commit straight to `master`. No feature branches, no PRs.
- Conventional commit prefixes (`feat:`, `chore:`, `fix:`).
- Keep comments brief. Only explain non-obvious constraints; skip anything the
  code already says.

## Deploy (since 2026-11-18)

Cloudflare Workers, static assets only, at `www.okuno.se` (a Route on a proxied record).
`cloudflare/wr deploy` runs `cloudflare/build.sh`, which assembles `dist/` from the files
`main.ts` serves, then uploads it. `main.ts` stays the local server (`run.sh`), so **a
change to its routing must be mirrored in `build.sh`**: the `/blog` and `/cv` 301s live in
`dist/_redirects`, the year-long cache in `dist/_headers`. A new top-level page directory
must be added to the `cp` line there, or it exists only locally.
