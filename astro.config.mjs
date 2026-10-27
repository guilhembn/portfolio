// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: set to the real domain once known (used for canonical URLs / sitemap).
  site: 'https://example.com',
  // Emit /about/index.html etc. Apache serves these as /about/ out of the box.
  build: { format: 'directory' },
});
