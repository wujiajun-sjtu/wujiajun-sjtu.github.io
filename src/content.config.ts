import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { categoryIds } from './site'

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '*.md',
    generateId({ entry }) {
      const id = entry.slice(0, -3)
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
        throw new Error(`文章文件名应使用小写英文字母、数字与连字符：${entry}`)
      }
      return id
    },
  }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.iso.date(),
    category: z.enum(categoryIds),
    example: z.boolean().default(false),
  }),
})

export const collections = { posts }
