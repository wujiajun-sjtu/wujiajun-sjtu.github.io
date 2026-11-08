import { visit } from 'unist-util-visit'
import { demos } from './registry.mjs'

export default function remarkDemos() {
  return (tree, file) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'demo') return

      const id = node.value.trim()
      if (node.meta || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !Object.hasOwn(demos, id)) {
        file.fail(
          `无法识别 demo 代码块中的演示短名 ${JSON.stringify(id)}。请在代码块中单独写一个已注册的短名。可用演示：${Object.keys(demos).join('、')}。`,
          node,
        )
      }

      const { title, description } = demos[id]
      parent.children[index] = {
        type: 'paragraph',
        children: [],
        position: node.position,
        data: {
          hName: 'figure',
          hProperties: { className: ['note-demo'] },
          hChildren: [
            element('figcaption', {}, [
              element('strong', {}, [text(title)]),
              element('span', {}, [text(description)]),
            ]),
            element('note-demo', { 'data-demo-id': id }),
            element('noscript', {}, [text('启用 JavaScript 后可操作此演示。')]),
          ],
        },
      }
    })
  }
}

function element(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children }
}

function text(value) {
  return { type: 'text', value }
}
