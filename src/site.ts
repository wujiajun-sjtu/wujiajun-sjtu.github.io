export const site = {
  title: '研习札记',
  subtitle: '一个研究生的学习与生活笔记',
  description: '记下课堂里想明白的公式、研究中尚未解开的问题，以及日常阅读与生活里的片段。',
}

export const categories = {
  course: { title: '课程笔记', description: '课堂上的概念、推导，以及值得动手试一试的问题。' },
  research: { title: '研究笔记', description: '读到的论文、试过的方法，以及还在思考的问题。' },
  journal: { title: '随笔日记', description: '读书后的几行字，与学习之外的日常片段。' },
} as const

export type Category = keyof typeof categories
export const categoryIds = Object.keys(categories) as Category[]

export function categoryUrl(category: Category) {
  return `/category/${category}/`
}
