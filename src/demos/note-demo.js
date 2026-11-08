import { demos } from './registry.mjs'
import panelStyles from './panel.css?inline'

class NoteDemo extends HTMLElement {
  #root = this.attachShadow({ mode: 'open' })
  #connection
  #dispose

  async connectedCallback() {
    const connection = new AbortController()
    this.#connection = connection

    const style = document.createElement('style')
    style.textContent = panelStyles
    const container = document.createElement('div')
    container.setAttribute('role', 'status')
    container.textContent = '正在加载演示…'
    this.#root.replaceChildren(style, container)

    try {
      const id = this.dataset.demoId
      if (!Object.hasOwn(demos, id)) throw new Error(`Unknown demo: ${id}`)

      const { mount } = await demos[id].load()
      if (connection.signal.aborted) return

      container.removeAttribute('role')
      container.textContent = ''
      this.#dispose = mount(container)
    } catch (error) {
      if (connection.signal.aborted) return
      container.setAttribute('role', 'status')
      container.textContent = '演示暂时无法加载，可以刷新页面后重试。'
      console.error('研习札记：演示加载失败', error)
    }
  }

  disconnectedCallback() {
    this.#connection?.abort()
    this.#dispose?.()
    this.#dispose = undefined
  }
}

if (!customElements.get('note-demo')) {
  customElements.define('note-demo', NoteDemo)
}
