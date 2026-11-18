#!/bin/bash
# Assembles dist/, the whole site as Workers static assets, from the files main.ts serves.
# main.ts stays the local dev server (run.sh); this mirrors what it answers:
# pages (index.html, projects/, japanese-numbers/), /static/*, /robots.txt and
# /favicon.ico from static/, the /blog and /cv 301s (_redirects) and the year-long cache
# on static files (_headers). Nothing else from the repo is uploaded.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/.." && pwd)
D="$REPO/dist"
rm -rf "$D"; mkdir -p "$D"
cp "$REPO/index.html" "$D/"
cp -r "$REPO/projects" "$REPO/japanese-numbers" "$REPO/static" "$D/"
cp "$REPO/static/robots.txt" "$REPO/static/favicon.ico" "$D/"

# Same as MOVED in main.ts: permanent, path and query kept.
cat > "$D/_redirects" <<'R'
/blog https://blog.okuno.se/ 301
/blog/* https://blog.okuno.se/:splat 301
/cv https://cv.okuno.se/ 301
/cv/* https://cv.okuno.se/:splat 301
R

# main.ts gave every css/ico/webp/png/js file a year of caching; pages none.
cat > "$D/_headers" <<'H'
/static/*
  Cache-Control: max-age=31536000
/*.css
  Cache-Control: max-age=31536000
/*.js
  Cache-Control: max-age=31536000
/*.png
  Cache-Control: max-age=31536000
H
echo "dist/: $(find "$D" -type f | wc -l) files"
