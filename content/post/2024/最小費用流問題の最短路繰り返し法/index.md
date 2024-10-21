+++
title = "最小費用流問題の最短路繰り返し法"
date = 2024-10-21T00:00:00+09:00
image = ""
categories= ["組合せ最適化", "アルゴリズム"]
tags = ["minimum cost flow"]
slug = "minimum-cost-flow-successive-shortest-path"
+++

## 最小費用流問題(Minimum Cost Flow Problem)

$N$ を頂点の集合，$A$ を辺の集合，$c_{ij}$ を辺 $(i, j)$ の単位流量あたりのコスト，$x_{ij}$ を辺 $(i, j)$ の流量，$b_i$ を頂点 i の需要/供給量，$l$ を辺の下限容量，$u$ を辺の上限容量としたとき，最小費用流問題（以下 MCFP）は以下のように定式化されます．  
1 つめの制約を流量保存則と呼び，第一項は頂点 $i$ から出る流量，第二項は頂点 $i$ に入る流量を表します．
2 つめの制約を容量制約と呼びます．

$$
\begin{aligned}
&\text{minimize} && \sum_{(i, j) \in A} c_{ij} x_{ij} \\
&\text{subject to}
&& \sum_{j:(i, j) \in A} x_{ij} - \sum_{j:(j,i) \in A} x_{ji} = b_i && \forall i \in N  \\
& && l_{ij} \le x_{ij} \leq u_{ij} && \forall (i, j) \in A
\end{aligned}
$$

以下ではコスト，流量，需要/供給，下限容量，上限容量はすべて整数とします．また，$\sum_{i \in N} b_i = 0$，コストを非負，下限容量を $0$ とします．

## 用語・定義

- pseudoflow

  - 容量制約を満たす flow を pseudoflow と呼びます．流量保存則には違反していてもかまいません．

- 残余容量

  - $r_{ij} = u_{ij} - x_{ij}$ を辺 (i, j) の残余容量と呼びます．

- imbalance

  - pseudoflow $\bold x$ に対し，頂点 $i$ の imbalance を次のように定義します．第 2 項は $i$ に入ってくる流量の合計，第 3 項は $i$ から出ていく流量の合計です．  
    $e(i) = b(i) + \sum_{j:(j, i) \in A} x_{ji} - \sum_{j:(i,j) \in A} x_{ij}$

- reduced cost

  - 各頂点のポテンシャル $\bold \pi$ が与えられたとき，$c_{ij}^{\pi} = c_{ij} - \pi(i) + \pi(j)$ を辺 (i, j) の reduced cost と呼びます．

## Reduced Cost 最適性

最小費用流問題の実行可能な flow $\bold x$ が最適であるための必要十分条件は，残余ネットワークのすべての辺 (i, j) に対して$c^{\pi}_{ij} \ge 0$ となるポテンシャル $\bold \pi$ が存在することです．

## 最短路繰り返し法(Successive Shortest Path Algorithm)

最短路繰り返し法は，容量制約を満たすが流量保存則に違反する pseudoflow $\bold x$ から開始します．  
アルゴリズムの各ステップでは reduced cost 最適性を維持しつつ，主問題の実行不能解 $\bold x$ を実行可能解に近づけます．  
具体的には，残余ネットワーク上で $e(k) \gt 0$ である頂点 $k$ から $e(l) \lt 0$ である頂点 $l$ へ，最短路に沿って flow を流すことで実行可能性を高めていきます．  
実行可能解が得られたときアルゴリズムは終了します．

最短路繰り返し法の流れは以下のようになります

- 初期解の構築
  - $\bold x = \bold 0$，$\bold \pi = \bold 0$ とする
- 実行可能解が得られるまで以下を繰り返す
  - $e(k) \gt 0$ である頂点 $k$ を選ぶ．各辺の reduced cost を距離とする残余ネットワーク上で，$k$ から各頂点への最短路を求める．$\bold P$ を $k$ から各頂点への最短路，$\bold d$ を最短距離とする
  - ポテンシャルの更新
    - $\bold \pi^{\prime} = \bold \pi - \bold d$
  - flow の更新
    - $\delta = min[e(k), min(r_{ij} : (i,j) \in P)]$とし，$\bold P$ に沿って辺の flow を $\delta$ 増加する
  - imbalance の更新
    - $e(k) = e(k) - \delta$，$e(l) = e(l) + \delta$ と更新する

次節からアルゴリズムの各ステップで常に reduced cost 最適性を維持することを確認していきます．

## 初期解の構築

初期解が容量制約と reduced cost 最適性を満たすことを確認します．  
仮定より，下限容量は $0$ のため $\bold x = \bold 0$ は容量制約を満たします．  
$\bold \pi = \bold 0$ のため $c_{ij}^{\pi} = c_{ij}$ です．辺のコストはすべて非負を仮定しているため $c_{ij}^{\pi} \ge 0$ となり reduced cost 最適性を満たします．

## ポテンシャルの更新

ある $\bold x$ に対し $\bold \pi$ が reduced cost 最適性を満たしているとき，ポテンシャルを $\bold \pi^{\prime} = \bold \pi - \bold d$ と更新しても reduced cost 最適性を満たすことを示します[^1]．

$\bold d$ は reduced cost を距離とした残余ネットワーク上での頂点 $k$ から各頂点への最短距離であるため，各辺 (i, j) は $d(j) \le d(i) + c_{ij}^{\pi}$ を満たします．

上の式に $c_{ij}^{\pi} = c_{ij} - \pi(i) + \pi(j)$ を代入します．  
$d(j) \le d(i) + c_{ij} - \pi(i) + \pi(j)$

$d(j)$を移項し，頂点ごとにまとめます．  
$c_{ij} - (\pi(i) - d(i)) + (\pi(j) - d(j)) \ge 0$

ポテンシャルの更新の仕方から以下が成り立ちます．  
$c_{ij} - \pi^{\prime}(i) + \pi^{\prime}(j) = c^{\pi_{ij}^{\prime}} \ge 0$

よって，ポテンシャルを $\bold \pi^{\prime} = \bold \pi - \bold d$ と更新しても reduced cost 最適性を満たすことがわかりました．

## flow の更新

最短路に沿って flow を更新したとき reduced cost 最適性を満たすことを確認します．

まず，ポテンシャルを $\bold \pi^{\prime} = \bold \pi - \bold d$ と更新したとき，頂点 $k$ から各頂点への最短路の辺の reduced cost が $0$ となることを確認します．  
頂点 $k$ から頂点 $l$ の最短路を考えます．最短路であるため，この経路の各辺は $d(j) = d(i) + c_{ij}^{\pi}$ を満たします．

上の式に $c_{ij}^{\pi} = c_{ij} - \pi(i) + \pi(j)$ を代入します．  
$d(j) = d(i) + c_{ij} - \pi(i) + \pi(j)$

$d(j)$ を移項し，頂点ごとにまとめます．  
$c_{ij} - (\pi(i) - d(i)) + (\pi(j) - d(j)) = 0$

ポテンシャルの更新の仕方から以下が成り立ちます．  
$c_{ij} - \pi^{\prime}(i) + \pi^{\prime}(j) = c^{\pi_{ij}^{\prime}} = 0$

よって，頂点 $k$ から各頂点への最短路の辺の reduced cost は $0$ となることがわかりました．

次に，flow を更新したとき reduced cost 最適性を満たすことを確認します．  
$\delta = min[e(s), min(r_{ij} : (i,j) \in P)]$ とし，最短路に沿って辺の flow を更新します．  
$\delta$ 選び方から，このように flow を更新しても容量制約を満たします．また，reduced cost が $0$ であるため，辺に flow を流すことで残余ネットワーク上に逆辺が生じたとしても reduced cost 最適性には違反しません．  
よって，最短路に沿って flow を更新したとき reduced cost 最適性を満たすことがわかりました．

## 計算量

$U$ を最大の供給量，$C$ をコストの最大値とします．  
アルゴリズムは各イテレーションで最短路問題を解き，供給量は厳密に減少します．
よって，$nU$ 回のイテレーションでアルゴリズムは終了します．最短路問題に 2 分ヒープを使った dijkstra 法を使うとすると $O((m + n) \log n)$ となります．  
よって，全体で $O(nU (m + n) \log n)$ となります．

## 補足：ポテンシャルの更新の改善

上記のアルゴリズムの説明では頂点 $k$ からすべての頂点に対する最短路を求めましたが，$e(l) \lt 0$ のような頂点を見つけたとき探索を終了することができます．  
dijkstra 法で最短距離を求めているとします．最短距離が確定した頂点を permanently labeled node，まだ確定していない頂点を temporarily labeled node と呼びます．  
このとき，ポテンシャルは以下のように更新することができます．

$$
\pi^{\prime} = \left\{
\begin{array}{ll}
\pi_{i} - d_{i} & \text{node i is permanently labeled}\\
\pi_{i} - d_{l} & \text{node i is temporarily labeled}
\end{array}
\right.
$$

<details>
<summary>証明</summary>
$S$ を permanently labeled node の集合，$\bar{S}$ を temporarily labeled node の集合とします．
頂点 $i$ と頂点 $j$ が $S$ と $T$ のどちらに属するかの 4 つ場合について，ポテンシャルが $\boldd \pi$ から $\bold \pi^{\prime}$ に変更されたときを考えます．

### 1. $i \in S, j \in S$ の場合

「ポテンシャルの更新」の節と同じです．

### 2. $i \in S, j \in \bar{S}$ の場合

$c^{\pi^{\prime}} = c_{ij}^{\pi} + d(i) - d(l)$ と更新されます．  
頂点 $j$ は最短距離と確定していないため，$d(l) \le d(j)$ です．  
また，頂点 $i$ は最短距離と確定しているため，dijkstra 法のアルゴリズムから $d(j) \le d(i) + c_{ij}^{\pi}$ が成り立ちます．  
よって，$d(l) \le d(i) + c_{ij}^{\pi}$ であるため $c_{ij}^{\pi^{\prime}} \ge 0$ を満たします．

### 3. $i \in \bar{S}, j \in S$ の場合

$c^{\pi^{\prime}} = c_{ij}^{\pi} + d(l) - d(j)$ と更新されます．  
頂点 $j$ は最短距離と確定しているため，$d(j) \le d(l)$ です．  
よって，$c\_{ij}^{\pi^{\prime}} \ge 0$ を満たします．

### 4. $i \in \bar{S}, j \in \bar{S}$ の場合

$c^{\pi^{\prime}} = c_{ij}^{\pi} + d(l) - d(l)$ と更新されます．  
よって，$c_{ij}^{\pi} \ge 0$ を満たします．

</details>

また，すべてのポテンシャルに定数を加算しても reduced cost 最適性に影響はないため，全体に $d(l)$ を加算することで以下のように更新することもできます．

$$
\pi^{\prime} = \left\{
\begin{array}{ll}
\pi_{i} - d_{i} + d_{l} & \text{node i is permanently labeled}\\
\pi_{i} & \text{node i is temporarily labeled}
\end{array}
\right.
$$

## 参考

- [Network Flows: Pearson New International Edition](https://www.amazon.co.jp/dp/1292042702)

[^1]: すべての頂点の距離が定まることを仮定しています．
