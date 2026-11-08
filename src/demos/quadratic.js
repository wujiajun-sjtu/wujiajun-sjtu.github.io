const plot = { left: 34, top: 16, width: 428, height: 228 }
const xRange = 6
const yRange = 8
const toX = (x) => (x + xRange) * plot.width / (2 * xRange)
const toY = (y) => (yRange - y) * plot.height / (2 * yRange)
const parameters = [
  { id: 'a', label: 'a · 开口系数', min: -2, max: 2, step: 0.25, initial: 1 },
  { id: 'h', label: 'h · 横向位移', min: -4, max: 4, step: 0.5, initial: 0 },
  { id: 'k', label: 'k · 纵向位移', min: -4, max: 4, step: 0.5, initial: 0 },
]

const grid = [
  ...[-6, -4, -2, 2, 4, 6].map((x) =>
    `<path d="M${toX(x)} 0V${plot.height}" />
     <text x="${toX(x)}" y="${toY(0) + 16}" text-anchor="${x === -6 ? 'start' : x === 6 ? 'end' : 'middle'}">${x}</text>`),
  ...[-8, -6, -4, -2, 2, 4, 6, 8].map((y) =>
    `<path d="M0 ${toY(y)}H${plot.width}" />
     <text x="${toX(0) - 7}" y="${Math.max(11, Math.min(plot.height - 3, toY(y) - 4))}" text-anchor="end">${y}</text>`),
].join('')

export function mount(container) {
  container.innerHTML = `
    <svg class="plot" viewBox="0 0 480 262" role="img" aria-label="二次函数坐标图，参数与顶点显示在图下方">
      <svg x="${plot.left}" y="${plot.top}" width="${plot.width}" height="${plot.height}" overflow="hidden">
        <rect x="0" y="0" width="${plot.width}" height="${plot.height}" fill="#f5f6ec" />
        <g fill="#596658" stroke="#dce2d5" font-family="system-ui, sans-serif" font-size="11" style="paint-order: stroke">${grid}</g>
        <path d="M${toX(0)} 0V${plot.height}M0 ${toY(0)}H${plot.width}" fill="none" stroke="#81937d" stroke-width="1.2" />
        <path data-curve fill="none" stroke="#3f6c4d" stroke-width="2.6" stroke-linejoin="round" />
        <circle data-vertex r="4.5" fill="#9a5d3d" stroke="#faf8f1" stroke-width="1.4" />
      </svg>
      <g fill="#596658" font-family="Georgia, serif" font-style="italic" font-size="13">
        <text x="${plot.left + plot.width - 8}" y="${plot.top + toY(0) - 5}">x</text>
        <text x="${plot.left + toX(0) + 7}" y="${plot.top + 10}">y</text>
      </g>
    </svg>
    <div class="ranges">${parameters.map(({ id, label, min, max, step, initial }) => `
      <label>
        <span>${label} <span class="range-value" data-value="${id}" aria-hidden="true">${initial}</span></span>
        <input type="range" name="${id}" min="${min}" max="${max}" step="${step}" value="${initial}" />
      </label>`).join('')}
    </div>
    <p class="readout"><span class="equation"></span> <span data-summary></span></p>
    <div class="demo-actions"><button type="button">恢复初始值</button></div>
  `

  const controls = parameters.map(({ id }) => ({
    input: container.querySelector(`[name="${id}"]`),
    value: container.querySelector(`[data-value="${id}"]`),
  }))
  const curve = container.querySelector('[data-curve]')
  const vertex = container.querySelector('[data-vertex]')
  const equation = container.querySelector('.equation')
  const summary = container.querySelector('[data-summary]')
  const events = new AbortController()

  function update() {
    const [a, h, k] = controls.map(({ input, value }) => {
      value.textContent = input.value
      return input.valueAsNumber
    })

    const points = []
    for (let i = 0; i <= 180; i += 1) {
      const x = -xRange + 2 * xRange * i / 180
      const y = a * (x - h) ** 2 + k
      points.push(`${toX(x).toFixed(2)},${toY(y).toFixed(2)}`)
    }
    curve.setAttribute('d', `M ${points.join(' L ')}`)
    vertex.setAttribute('cx', toX(h))
    vertex.setAttribute('cy', toY(k))
    vertex.style.display = a === 0 ? 'none' : ''

    equation.textContent = a === 0
      ? `y = ${k}`
      : `y = ${a}(x ${h < 0 ? '+' : '−'} ${Math.abs(h)})² ${k < 0 ? '−' : '+'} ${Math.abs(k)}`
    summary.textContent = a === 0 ? '水平直线' : `顶点（${h}, ${k}）`
  }

  container.addEventListener('input', update, { signal: events.signal })
  container.querySelector('button').addEventListener('click', () => {
    controls.forEach(({ input }) => { input.value = input.defaultValue })
    update()
  }, { signal: events.signal })
  update()

  return () => events.abort()
}
