// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGithubAlerts from 'remark-github-alerts';

// https://astro.build/config
export default defineConfig({
  base: '/portfolio-web',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkGithubAlerts],
      rehypePlugins: [rehypeKatex]
    })
  },
  vite: {
    plugins: [tailwindcss()]
  }
});