import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects/.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Show on the home page.
    featured: z.boolean().default(false),
    // Hidden from listings and not built.
    draft: z.boolean().default(false),
    // Optional external link (repo, paper, live demo...).
    link: z.url().optional(),
    // Optional path to an interactive page in the lab, e.g. "/lab/orbit/".
    lab: z.string().optional(),
  }),
});

export const collections = { projects };
