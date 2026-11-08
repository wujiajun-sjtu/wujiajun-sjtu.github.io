---
title: "从随机游走看扩散"
description: "用一段可以暂停的轨迹，区分走过的步数与离起点的距离。"
date: "2026-11-04"
category: research
example: true
---

让一个粒子从平面原点出发，每一步等概率向上、下、左、右移动一格，并且每次选择都相互独立。路径总长度随步数增加，离起点的距离却时远时近。

## 先看一条路径

用「单步」观察位移向量怎样相加，再播放一段轨迹。每次重置后会生成新的路径。绘图区随轨迹调整比例，最多保留最近 360 步，步数和位置从原点开始累计。

~~~demo
random-walk
~~~

## 再看多次实验的平均

记第 $i$ 步的位移为 $\Delta_i$，第 $n$ 步后的位置为 $\mathbf{S}_n = \sum_{i=1}^n \Delta_i$。每一步长度为 $1$，位移的期望为零。不同步之间独立，因此平方展开后交叉项的期望为零。

$$
\mathbb{E}\!\left[\lVert \mathbf{S}_n \rVert^2\right]
= \sum_{i=1}^{n} \mathbb{E}\!\left[\lVert \Delta_i \rVert^2\right]
= n.
$$

这给出了距离的一个典型尺度，即均方根距离 $\sqrt{n}$。把步数增加到四倍时，均方根距离增加到两倍。

### 留给下一次的实验

固定终止步数，重复游走并记录每次的终点。把终点到原点的距离平方取平均，再与理论值比较。每次移动可以用一个很短的函数表示：

~~~js
const moves = [[1, 0], [-1, 0], [0, 1], [0, -1]]

function nextPosition([x, y]) {
  const [dx, dy] = moves[Math.floor(Math.random() * moves.length)]
  return [x + dx, y + dy]
}
~~~
