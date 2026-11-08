const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const trailLimit = 360

export function mount(container) {
  container.innerHTML = `
    <canvas class="plot" role="img" aria-label="二维随机游走轨迹，当前位置和步数显示在图下方"></canvas>
    <div class="demo-actions">
      <button type="button" class="primary" data-play>播放</button>
      <button type="button" data-step>单步</button>
      <button type="button" data-reset>重置</button>
    </div>
    <div class="ranges speed">
      <label>
        <span>播放速度 <span class="range-value" aria-hidden="true">6 步/秒</span></span>
        <input type="range" min="2" max="12" value="6" />
      </label>
    </div>
    <p class="readout" data-stats></p>
  `

  const canvas = container.querySelector('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable')

  const play = container.querySelector('[data-play]')
  const speed = container.querySelector('input')
  const speedValue = container.querySelector('.range-value')
  const stats = container.querySelector('[data-stats]')
  const events = new AbortController()
  let trail = [[0, 0]]
  let steps = 0
  let frame = null
  let lastStep = null

  function draw() {
    const { clientWidth: width, clientHeight: height } = canvas
    if (!width || !height) return

    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const pixelsWide = Math.round(width * ratio)
    const pixelsHigh = Math.round(height * ratio)
    if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
      canvas.width = pixelsWide
      canvas.height = pixelsHigh
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const extent = Math.max(5, ...trail.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))))
    const unit = Math.min(width, height) / (2 * extent + 2)
    const toX = (x) => width / 2 + x * unit
    const toY = (y) => height / 2 - y * unit
    const gridInterval = Math.max(1, Math.ceil(18 / unit))

    context.beginPath()
    for (let x = -Math.floor(width / (2 * unit * gridInterval)); toX(x * gridInterval) < width; x += 1) {
      context.moveTo(toX(x * gridInterval), 0)
      context.lineTo(toX(x * gridInterval), height)
    }
    for (let y = Math.floor(height / (2 * unit * gridInterval)); toY(y * gridInterval) < height; y -= 1) {
      context.moveTo(0, toY(y * gridInterval))
      context.lineTo(width, toY(y * gridInterval))
    }
    context.lineWidth = 1
    context.strokeStyle = '#dce2d5'
    context.stroke()

    context.beginPath()
    context.moveTo(toX(0), 0)
    context.lineTo(toX(0), height)
    context.moveTo(0, toY(0))
    context.lineTo(width, toY(0))
    context.strokeStyle = '#96a392'
    context.stroke()

    context.beginPath()
    trail.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(toX(x), toY(y))
      else context.lineTo(toX(x), toY(y))
    })
    context.lineJoin = 'round'
    context.lineCap = 'round'
    context.lineWidth = 2.25
    context.strokeStyle = '#547c5f'
    context.stroke()

    const [x, y] = trail.at(-1)
    context.beginPath()
    context.arc(toX(0), toY(0), 3, 0, 2 * Math.PI)
    context.fillStyle = '#547c5f'
    context.fill()
    context.beginPath()
    context.arc(toX(x), toY(y), 4.4, 0, 2 * Math.PI)
    context.fillStyle = '#9a5d3d'
    context.fill()
  }

  function update() {
    const [x, y] = trail.at(-1)
    stats.textContent = `步数 ${steps}　·　位置（${x}, ${y}）　·　距起点 ${Math.hypot(x, y).toFixed(2)}`
    draw()
  }

  function step() {
    const [x, y] = trail.at(-1)
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]
    trail.push([x + dx, y + dy])
    if (trail.length > trailLimit + 1) trail.shift()
    steps += 1
    update()
  }

  function tick(now) {
    lastStep ??= now
    if (now - lastStep >= 1000 / speed.valueAsNumber) {
      step()
      lastStep = now
    }
    frame = requestAnimationFrame(tick)
  }

  function pause() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    lastStep = null
    play.textContent = '播放'
  }

  play.addEventListener('click', () => {
    if (frame !== null) {
      pause()
    } else {
      play.textContent = '暂停'
      frame = requestAnimationFrame(tick)
    }
  }, { signal: events.signal })
  container.querySelector('[data-step]').addEventListener('click', () => {
    pause()
    step()
  }, { signal: events.signal })
  container.querySelector('[data-reset]').addEventListener('click', () => {
    pause()
    steps = 0
    trail = [[0, 0]]
    speed.value = speed.defaultValue
    speedValue.textContent = `${speed.value} 步/秒`
    update()
  }, { signal: events.signal })
  speed.addEventListener('input', () => {
    speedValue.textContent = `${speed.value} 步/秒`
  }, { signal: events.signal })

  const resize = new ResizeObserver(draw)
  resize.observe(canvas)
  update()

  return () => {
    pause()
    resize.disconnect()
    events.abort()
  }
}
