import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    coverImage: z.string(),
    category: z.string(),
    visualizations: z.array(z.object({
      filename: z.string(),
      title: z.string(),
      description: z.string()
    }))
  })
});

export const collections = {
  projects: projectsCollection,
};
