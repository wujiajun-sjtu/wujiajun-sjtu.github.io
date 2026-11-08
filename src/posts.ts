import { getCollection } from 'astro:content'

export async function getPosts() {
  const posts = await getCollection('posts')
  return posts.sort((a, b) =>
    b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id),
  )
}

export function postUrl(id: string) {
  return `/posts/${id}/`
}
