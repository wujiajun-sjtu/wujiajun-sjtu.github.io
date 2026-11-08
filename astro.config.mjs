import { unified } from '@astrojs/markdown-remark'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkDemos from './src/demos/remark-demos.mjs'

export default defineConfig({
  site: 'https://wujiajun-sjtu.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkDemos],
      rehypePlugins: [rehypeKatex],
      remarkRehype: {
        footnoteLabel: '脚注',
        footnoteBackLabel: '返回正文',
      },
      shikiConfig: { theme: 'github-light' },
    }),
  },
})
