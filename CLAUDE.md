# homepage-okuno

Personal homepage: a small Deno HTTP server (`main.ts`) that serves static HTML
pages and assets. No framework, no build step, no dependencies.

## Layout

- `main.ts` — the whole server. Routing is a chain of `if` checks on `pathname`.
- `index.html` — root page. Each subdirectory (`quotes/`, `tips-tricks/`,
  `crypto-web3/`, `japanese-numbers/`) holds its own `index.html`.
- `static/` — shared CSS, JS, images, `robots.txt`, `favicon.ico`.

Paths without a trailing slash get a 307 redirect to the slash form, which then
resolves to `<dir>/index.html`.

## Run

```
deno task dev      # watch mode on :3000, or set PORT
```

`deno check main.ts` and `deno lint` before committing.

## Deploy

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
