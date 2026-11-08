# 研习札记

一个用本地 Markdown 写作的中文博客。课程笔记、研究笔记与随笔日记各有分类页。

## 本地启动

在项目目录的 PowerShell 中运行：

~~~powershell
.\blog.cmd
~~~

打开 [本地预览](http://127.0.0.1:4321/)。终端显示的地址会反映实际使用的端口。

启动脚本会使用系统上的 Node.js 和 pnpm。如果普通 PowerShell 找不到它们，会使用本机 Codex 自带的工具。项目所需依赖已经安装。首次安装或重新安装时，可运行：

~~~powershell
.\blog.cmd install --frozen-lockfile --store-dir .pnpm-store --ignore-scripts
~~~

在另一台没有 Codex 的电脑上，使用 Node.js 24 和 pnpm 11。环境装好后也可以直接运行 `pnpm dev`。

## 写一篇新笔记

在 `src/content/posts/` 新建 `my-note.md`。文件名用小写字母、数字和连字符，它对应文章地址 `/posts/my-note/`。

~~~markdown
---
title: "一篇新笔记"
description: "写一两句话概括这篇文章。"
date: "2026-11-08"
category: course
---

## 从一个问题开始

正文可以使用 **加粗**、表格、脚注和代码块。
~~~

`category` 可填写 `course`（课程笔记）、`research`（研究笔记）或 `journal`（随笔日记）。日期用带引号的 `YYYY-MM-DD`。带有 `example: true` 的文章会显示示例标记。正文从二级标题开始，文章有两个以上的二级或三级标题时会生成目录。

把图片放入文章目录下的 `assets/my-note/`，用相对路径写入正文。方括号内填图片说明。

~~~markdown
![散点图，横轴为步数，纵轴为距离平方](./assets/my-note/experiment.png)
~~~

行内公式用单个美元符号包围，独立公式用各占一行的双美元符号包围。

~~~markdown
两点之间的距离记为 $d$。

$$
d = \sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.
$$
~~~

站名、首页简介和分类说明可在 `src/site.ts` 中修改。

## 在文章中插入交互演示

使用 `demo` 代码块，块内单独写演示短名。内置演示为 `quadratic` 和 `random-walk`。

~~~markdown
```demo
quadratic
```
~~~

新增演示时，在 `src/demos/` 写一个 JavaScript 模块，并在 `registry.mjs` 注册。比如创建 `counting.js`：

~~~js
export function mount(container) {
  let count = 0
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = '计数 0'

  function increment() {
    count += 1
    button.textContent = '计数 ' + count
  }

  button.addEventListener('click', increment)
  container.append(button)

  return () => button.removeEventListener('click', increment)
}
~~~

在 `demos` 注册表中添加：

~~~js
counting: {
  title: '一个计数演示',
  description: '每点击一次，计数增加一。',
  load: () => import('./counting.js'),
},
~~~

这样就能在 Markdown 中引用 `counting`。每次插入都会调用一次 `mount(container)`，计时器、动画状态和事件监听可放在这个函数内。组件离开页面时会调用返回的清理函数。组件使用独立的样式作用域，可在容器内加入样式和 SVG、Canvas 等元素。图形库可以作为项目依赖，由演示模块导入。

## 检查构建结果

~~~powershell
.\blog.cmd build
.\blog.cmd preview
~~~

构建后的静态文件位于 `dist/`，`.\blog.cmd preview` 会在本机预览这份产物。
