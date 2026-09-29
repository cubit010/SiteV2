# cubit010.dev

KiCad-themed personal site. Dark = PCB editor, light = schematic editor. Plain HTML/CSS/JS, no build step.
Preview locally: `python3 -m http.server` then open http://localhost:8000

## Deploy
1. Repo Settings > Pages > Source: **GitHub Actions**; set custom domain `cubit010.dev` (and add the DNS records GitHub lists).
2. Push to `main`.

## Secret page (public repo, private page)
The real page never enters git; the workflow injects it at deploy time from repo secrets.
1. `cp secret.example.html secret.html` and edit it (`secret.html` is gitignored; preview at /secret.html locally).
2. Repo Settings > Secrets and variables > Actions:
   - `SECRET_SLUG`: a random path, e.g. `n0t-h3re-4a7f` (page appears at cubit010.dev/n0t-h3re-4a7f/)
   - `SECRET_PAGE_B64`: output of `base64 -w0 secret.html` (macOS: `base64 -i secret.html`), under 48 KB
3. Re-run the deploy workflow.

Caveat: this hides the page from the repo, not from anyone who learns the URL. Don't put real credentials on it.
Never commit the real secret.html, since git history is forever. If the slug leaks, change the secret.
