export const demos = {
  quadratic: {
    title: '交互演示 · 抛物线的三个旋钮',
    description: '分别改变开口系数、横向位移和纵向位移，观察曲线与顶点的变化。',
    load: () => import('./quadratic.js'),
  },
  'random-walk': {
    title: '交互演示 · 二维随机游走',
    description: '粒子每次等概率朝四个方向之一移动。比较步数和离起点的距离。',
    load: () => import('./random-walk.js'),
  },
}
