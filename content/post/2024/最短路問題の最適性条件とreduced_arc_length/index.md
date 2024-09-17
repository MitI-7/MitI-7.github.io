+++
title = "最短路問題の最適性条件と reduced arc length"
date = 2024-09-17T00:00:00+09:00
image = ""
categories = "組合せ最適化" 
tags = ["最短路問題", "アルゴリズム", "競技プログラミング"]
slug = "shortest-path-optimality-condition-reduced-arc-length"
+++

## 最短路問題

有向グラフが与えられたとき，始点 s から各頂点への最短路を求める問題を単一始点最短路問題といいます．以下では，頂点数を $n$，辺数を $m$，各辺 (u, v) のコストを $c_{uv}$ で表します．また，グラフは強連結を仮定します．

## 最短路問題の最適性条件

頂点集合を $N$，辺集合を $A$，辺 (u, v) のコストを $c_{uv}$ とします．始点 s から各頂点 v への有向パスの距離の上界を $d(v)$ で表し，これを距離ラベルと呼びます．特に，$d(s) = 0$ です．各頂点 $v \in N$ について，$d(v)$ が始点 s から頂点 v の最短路の長さであるための必要十分条件は以下が成り立つことです．

$$
\begin{equation}
d(v) \le d(u) + c_{uv} \quad \forall (u, v) \in A
\end{equation}
$$

不等式 (1) は，各辺 $(u, v) \in A$ について，頂点 v への距離は頂点 u への距離 + $c_{uv}$ 以下であることを表しています．

<details><summary>証明</summary>

まず，必要条件であることを示します．  
対偶をとり，$d(v) \gt d(u) + c_{uv}$ ならば，距離ラベルが最短路の長さではないことを示します．  
$d(v) \gt d(u) + c_{uv}$ であるような辺があれば，頂点 u を経由することで頂点 v への距離を改善することができます．  
したがって，距離ラベル $d$ は最短路の長さではありません．

次に，十分条件であることを示します．  
頂点 s から頂点 v への任意の有向パスが $s = i_1 \rightarrow i_2 \rightarrow ... \rightarrow i_{k-1} \rightarrow i_k = v$ であったとします．  
不等式 (1) から以下の式がそれぞれ成り立ちます．

$$
\begin{aligned}
d(v) =\; & d(i_k) && \le\; d(i_{k - 1}) && +\; c_{i_{k - 1}i_{k}}, \\
& d(i_{k - 1}) && \le\; d(i_{k - 2}) && +\; c_{i_{k - 2} i_{k - 1}}, \\
& \vdots \\
& d(i_{2}) && \le\; d(i_{1}) && +\; c_{i_{1}i_{2}} = c_{i_{1}i_{2}}.
\end{aligned}
$$

式をそれぞれ代入すると

$$
d(v) = d(i_{k}) \le c_{i_{k-1}i_{k}} + c_{i_{k-2}i_{k-1}} + \dots + c_{i_{1}i_{2}} = \sum_{(u, v) \in P} c_{uv}
$$

となり，$d(v)$ は，始点 s から頂点 v への任意の有向パスのコストの合計の下界になります．
$d(v)$ は始点 s から頂点 v への任意の有向パスの下界かつ上界なので，距離ラベル $d(v)$ は最短路の長さです．

以上のことから，「各頂点 $v \in N$ について距離ラベル $d(v)$ が最短路の長さである」の必要十分条件は，「各辺 $(u, v) \in A$ について $d(v) \le d(u) + c_{uv}$ を満たす」であることがわかりました．

</details>

## reduced arc length の性質

ある距離ラベル $d$ に対し，$c_{uv}^{d} = c_{uv} + d(u) - d(v)$ を reduced arc length と呼びます．reduced arc length には次の性質があります．

1. 任意の閉路 $W$ について，$\sum_{(u, v) \in W} c_{uv}^{d} = \sum_{(u, v) \in W} c_{uv}$
2. 頂点 k から頂点 l への任意の有向パス $P$ について，$\sum_{(u, v) \in P} c_{uv}^{d} = \sum_{(u, v) \in P} c_{uv} + d(k) - d(l)$
3. 距離ラベル $d$ が最適ならば，すべての辺 (u, v) について $c_{uv}^{d} \ge 0$ が成り立つ

<details><summary>性質 1 の証明</summary>

$$
\begin{aligned}
\sum_{(u, v) \in W} c_{uv}^{d} &= \sum_{(u, v) \in W} (c_{uv} + d(u) - d(v)) \\
&= \sum_{(u, v) \in W} c_{uv} + \sum_{(u, v) \in W} (d(u) - d(v)) \\
&= \sum_{(u, v) \in W} c_{uv} \\
\end{aligned}
$$

任意の有向閉路 $W$ において，頂点 u は $+d(u)$としてちょうど 1 回，$-d(u)$ としてちょうど 1 回出現するため，$\sum_{(u, v) \in W} (d(u) - d(v)) = 0$ が成り立ちます．

</details>

<details><summary>性質 2 の証明</summary>

$$
\begin{aligned}
\sum_{(u, v) \in P} c_{uv}^{d} &= \sum_{(u, v) \in P} (c_{uv} + d(u) - d(v)) \\
&= \sum_{(u, v) \in P} c_{uv} + \sum_{(u, v) \in P} (d(u) - d(v)) \\
&= \sum_{(u, v) \in P} c_{uv} + d(k) - d(l) \\
\end{aligned}
$$

頂点 k と頂点 l 以外の頂点は，$+d(u)$ としてちょうど 1 回，$-d(u)$ としてちょうど 1 回出現するため互いに打ち消し合います．  
頂点 k は $+d(k)$ として，頂点 $l$ は $-d(l)$ としてちょうど 1 回出現します．

</details>
<details><summary>性質 3 の証明</summary>
最適性条件から直ちに言えます
</details>

次節からは，reduced arc length の性質を使ったアルゴリズムと問題を見ていきます．

## Johnson's algorithm

任意の 2 頂点の組 (u, v) に対して頂点 u から頂点 v の最短路を求める問題を全点対最短路問題と呼びます．  
Johnson's algorithm は全点対最短路問題を解くアルゴリズムです．

頂点数が $n$ のとき，単一始点最短路問題を n 回解くことによって全点対最短路を求めることができます．  
ただし，グラフにコストが負の辺があると，単一始点最路問題を解くのに Dijkstra 法を使うことができません．そこで，グラフのコストを reduced arc length に変換したグラフ上で最短路を求めることにします．reduced arc length の性質 3 から，最適距離ラベル $d$ に対する reduced arc length のコストはすべて 0 以上であるため Dijkstra 法を使うことができます．  
変換したグラフ上で最短距離を求めたあと，性質 2 を使って元のグラフの距離に変換します．  
最適距離ラベルは Bellman–Ford 法を使い求めることができます．負閉路が見つかった場合はアルゴリズムを終了します．

Dijkstra 法に二分ヒープを使うとき，Bellman–Ford 法に $O(nm)$，Dijkstra 法に $O((n + m) \log n)$ かかるため，計算量は全体として $O(nm + n ((n + m) \log n))$ となります．

例として，[AOJ - All Pairs Shortest Path](https://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=GRL_1_C&lang=ja) を解きます．  
与えられるグラフは強連結ではないため，人工頂点 s を追加し，s から他のすべての頂点に重さ 0 の辺を張ります．この s を始点として Bellman-Ford 法を使うことで最適距離ラベルを求めることができます．  
実装では人工頂点を追加するのではなく， Bellman-Ford の初期解をすべて 0 とすることで対応しています．  
[提出コード](https://judge.u-aizu.ac.jp/onlinejudge/review.jsp?rid=9647270#1)

## [ABC237 E - Skiing](https://atcoder.jp/contests/abc237/tasks/abc237_e)

問題概要  
$N$ 頂点，$M$ 辺の強連結の有向グラフと各頂点 u の高さ $H(u)$ が与えられる．$H(u) \ge H(v)$ としたとき，頂点 u から頂点 v にはコスト $H(v) - H(u)$ の辺が，頂点 v から頂点 u にはコスト $2(H(u) - H(v))$ の辺が張られている．頂点 1 から各頂点への最短距離の中で最も小さいものを求めよ．

負辺のあるグラフの最短路問題なので Bellman–Ford 法を使えば答えが求まりますが，Bellman–Ford 法の計算量は $O(nm)$ なので TLE になってしまいます．
そこで，グラフのコストを reduced arc length に変換したグラフ上で最短路を求めることにします．

まず，不等式 (1) を満たすような距離ラベルを考えます．  
ある距離ラベル $d$ に対して，$H(u) \ge H(v)$ のとき，$c_{uv}^{d}$ と $c_{vu}^{d}$ は以下のように表せます．

$$
\begin{aligned}
c_{uv}^{d} &= c_{uv} + d(u) - d(v) = H(v) - H(u) + d(u) - d(v) \\
c_{vu}^{d} &= c_{vu} + d(v) - d(u) = 2(H(u)- H(v)) + d(v) - d(u) \\
\end{aligned}
$$

u と v についてまとめて式を整理します．

$$
\begin{aligned}
c_{uv}^{d} &= (H(v) - d(v)) - (H(u) - d(u)) \\
c_{vu}^{d} &= (2H(u) - d(u)) - (2H(v) - d(v)) \\
\end{aligned}
$$

$c_{uv}^{d} \ge 0$ かつ $c_{vu}^{d} \ge 0$ にしたいので，各頂点 u について $d(u) = H(u)$ とすると以下のようになります．

$$
\begin{aligned}
c_{uv}^{d} &= (H(v) - H(v)) - (H(u) - H(u)) = 0 \\
c_{vu}^{d} &= (2H(u) - H(u)) - (2H(v) - H(v))  = H(u) - H(v)\\
\end{aligned}
$$

以上のことから，次のように問題を言い換えることができます．  
$N$ 頂点，$M$ 辺の強連結の有向グラフと各頂点 u の高さ $H(u)$ が与えられる．$H(u) \ge H(v)$ のとき，頂点 u から頂点 v にはコスト 0 の辺が，頂点 v から頂点 u にはコスト $H(u) - H(v)$ の辺が張られている．頂点 1 から各頂点への最短距離の中で最も小さいものを求めよ．

すべての辺のコストは 0 以上なので Dijkstra 法で求めることができます．  
求まる値は変換したグラフ上での値なので，$distance[u] - H[0] + H[u]$ として元のグラフ上での値に戻します．

[提出コード](https://atcoder.jp/contests/abc237/submissions/57838602)

## 参考

- [Network Flows: Pearson New International Edition](https://www.amazon.co.jp/dp/1292042702)
- [Johnson's algorithm](https://en.wikipedia.org/wiki/Johnson%27s_algorithm)
- [E - Skiing 解説](https://atcoder.jp/contests/abc237/editorial/3339)
