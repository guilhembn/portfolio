# Portfolio

Personal site built with [Astro](https://astro.build): static HTML by default, with
JavaScript only on the pages that need it (3D, games, emulators in `/lab`).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + build to dist/
npm run preview    # serve dist/ locally
```

## Layout

| Path | What |
| --- | --- |
| `src/content/projects/*.md` | One file per project. Front matter schema in `src/content.config.ts`. |
| `src/pages/` | Routes. `projects/[slug].astro` renders each project. |
| `src/pages/lab/` | Interactive experiments, one page each. Add new ones to the list in `lab/index.astro`. |
| `src/scripts/` | Client-side code for the lab (Three.js scenes, games, …). |
| `src/layouts/Base.astro` | Shared `<head>`, nav, footer. |
| `src/styles/global.css` | Design tokens (light/dark) and shared styles. |
| `public/` | Copied as-is: favicon, images, CV, `.wasm` files. |
| `deploy/` | Apache vhost and deploy script. |

## Deploy

The VPS serves the built files from `/var/www/portfolio` through its own Apache vhost
(`deploy/portfolio.conf`), separate from Nextcloud.

1. First time on the VPS:
   ```bash
   sudo mkdir -p /var/www/portfolio && sudo chown "$USER": /var/www/portfolio
   ```
   then install the vhost as described at the top of `deploy/portfolio.conf`.
2. Locally: `cp deploy/.deploy.env.example deploy/.deploy.env` and fill it in.
3. `./deploy/deploy.sh --dry-run` to check, then `./deploy/deploy.sh`.
