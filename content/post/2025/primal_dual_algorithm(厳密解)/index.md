+++
title = "Primal Dual Algorithm(厳密解)"
date = 2025-03-14T00:00:00+09:00
draft = false
image = ""
categories = "組合せ最適化" 
tags = ["primal dual", ""]
+++

## はじめに

厳密解を求める primal dual algorithm の話です．  
primal dual algorithm の一般的な説明をしたあと，具体例としてハンガリアン法を導出します．

## 準備

以下の等式標準形の線形計画問題を考えます．簡単のため $\bold b \ge 0$ を仮定します．

- 主問題

  $$
  \begin{aligned}
  &\text{minimize} && \bold c^{T} \bold x \\
  &\text{subject to}
  && \bold A \bold x = \bold b \\
  & && \bold x \geq 0
  \end{aligned}
  $$

- 双対問題
  $$
  \begin{aligned}
  &\text{maxiimize} && \bold b^{T} \bold y \\
  &\text{subject to}
  && \bold A^{T} \bold y \leq \bold c
  \end{aligned}
  $$

$\bold x$ と $\bold y$ が主問題と双対問題の最適解であるための必要十分条件は，以下の 2 つの条件をともに満たすことです．  
$A_i$ は行列 $\bold A$ の $i$行目を，$A^{j}$ は行列 $\bold A$ の $j$ 列目の転置をとったものを表します．今回は主問題の制約条件に $\bold A \bold x = \bold b$ があるため，双対相補性条件を常に満たします．

- 主相補性条件

  $$
  \begin{aligned}
  && x_{j} \gt 0 \Rightarrow \bold A^{j} \bold y = c_{j} &&& \forall j \\
  \end{aligned}
  $$

- 双対相補性条件
  $$
  \begin{aligned}
  && y_{i} \gt 0 \Rightarrow \bold A_{i} \bold x = b_{i} &&& \forall i \\
  \end{aligned}
  $$

${\bold x}^{\star}$ と ${\bold y}^{\star}$ が主問題と双対問題の最適解であるとき以下が成立します．

$$
\begin{aligned}
&& \bold c^{T} \bold x^{\star} = \bold b^{T} \bold y^{\star} \\
\end{aligned}
$$

## Primal Dual Algorithm

primal dual algorithm は線形計画問題を解くための一般的なアルゴリズムです．  
primal dual algorithm を用いて主問題の最適解 ${\bold x}^{\star}$ を求めます．簡単のため，主問題には実行可能解があると仮定します．primal dual algorithm は以下のように実行されます．双対問題の実行可能性が常に維持されていることに注意してください．

1. 双対問題の実行可能解 $\bold y$ を求める
2. $\bold y$ をもとに構築した restricted primal problem を解く
3. restricted primal problem の最適解の値が $0$ ならば，最適解 $\bold {x}^{\star}$ が判明したということなのでアルゴリズムを終了する
4. restricted primal problem の最適解の値が $0$ でないならば，restricted primal problem の双対問題である dual restricted primal の最適解を求める．この解を $\bold z$ とする
5. ある $\epsilon$ を求め，${\bold y}^{\prime} = {\bold y} + \epsilon {\bold z}$ を新たな双対問題の実行可能解として採用し，2 に戻る

順に詳しくみていきます．

1. 双対問題の実行可能解 $\bold y$ を適当に求めます．$\bold c \ge 0$ を仮定しているため $\bold y = \bold 0$ とおくことができます．
2. ある双対問題の解 $\bold y$ が与えられたときに，「主問題の制約の違反」と「相補性条件の違反」を最小にするような主問題の解 $\bold x$ を見 つける問題を考えます．もしこれらの違反量が 0 の $\bold x$ を見つけることができたら，相補性条件よりこの $\bold x$ と $\bold y$ は最適解だということになります．  
    $J = \lbrace j \mid \bold A^{j} \bold y = c_{j} \rbrace$ とします．これは正になることのできる主問題の変数の index の集合です．すると，この問題は以下のような線形計画問題となります．これを restricted primal(以下 RP)とよびます．

   - Restricted Primal
     $$
     \begin{aligned}
     &\text{minimize} && \sum_i s_i \\\
     &\text{subject to}
     && \sum_{j \in J}  \bold A_{ij} \bold x_j + \bold s_i = \bold b_i &&& \forall i\\\
     & && \bold x \geq \bold 0 &&& j \in J\\\
     & && \bold x = \bold 0 &&& j \notin J\\\
     & && \bold s \geq \bold 0
     \end{aligned}
     $$

3. もし RP の最適解の値が $0$ なら，この $(\bold x, \bold y)$ が主問題と双対問題の最適解ということになりアルゴリズムは終了します．
4. そうでない場合は相補性条件を満たすような実行可能解 $\bold x$ が見つからなかったということなので，$\bold y$ は双対問題の最適解ではなかったということがわかります．  
    そこで，$\bold y$ よりも良い双対問題の解を探すことにします．  
    そのために RP の双対問題である Dual Restricted Primal(以下 DRP)を考えます．これは以下のようになります．

   - Dual Restricted Primal
     $$
     \begin{aligned}
     &\text{maxmize} && \bold b^{T} \bold z \\\
     &\text{subject to}
     && \bold A^{j} \bold z \leq 0 &&& j \in J \\\
     & && z_{i} \leq 1 &&& \forall i \\\
     \end{aligned}
     $$

5. DRP の最適解を $\bold z^{\star}$ とします．
   双対問題の実行可能解 $\bold y$ に $\bold z^{\star}$ を $\epsilon(\epsilon \gt 0)$ 倍して足し合わせた解 ${\bold y}^{\prime} = \bold y + \epsilon \bold z^{\star}$ を考えます．
   実はうまく $\epsilon$ を選ぶことで $\bold y^{\prime}$ は元の解 $\bold y$ よりも良い目的関数値をとり，さらに実行可能解となっています．  
   $\bold y$ よりも良い解 $\bold y^{\prime}$ が手に入れば，これを新たな双対問題の解として採用し，また 2 に戻り RP を考え...と手順を繰り返していくことで，やがて最適解を得ることができます．

最後に，$\bold y^{\prime} = \bold y + \epsilon \bold z^{\star}$ が解 $\bold y$ よりも良い解となることと $\bold y^{\prime}$ が実行可能解となるような $\epsilon$ の選び方を示します．

- $\bold y^{\prime} = \bold y + \epsilon \bold z^{\star}$ が解 $\bold y$ よりも良くなることを示します．  
  $\bold y^{\prime} = \bold y + \epsilon \bold z$ を双対問題の目的関数に当てはめると $\bold b^{T} \bold y^{\prime} = \bold b^{T} \bold y + \epsilon \bold b^{T} \bold z^{\star}$ となります．  
  $\epsilon \bold b^{T} \bold z^{\star} \gt 0$ となることを確認します．  
  $\epsilon$ は $0$ より大きい値をとるため，$\epsilon \gt 0$ となります．  
  RP の最適解の値は 0 より大きかったため，その双対問題である DRP の最適解の値も 0 より大きいことになります．よって，$\bold b^{T} \bold z^{\star} \gt 0$ といえます．  
  以上のことから，$\bold y^{\prime}$ が $\bold y$ より良い目的関数値をとることがわかりました．

- $\bold y^{\prime} = \bold y + \epsilon \bold z^{\star}$ が双対問題の実行可能解となるような $\epsilon$ の選び方を示します．  
  双対問題の実行可能解になるように制約条件 $\bold A^{T} \bold y^{\prime} \leq \bold c$ を満たすような $\epsilon$ を求めます．  
  まず，双対問題の制約条件より $\bold A^{T} \bold y \le \bold c$ です．  
  次に，DRP の制約条件より $j \in J$ については $\bold A^{j} \bold z^{\star} \le 0$ となります．
  よって，$j \in J$ であるような $j$ については制約条件を満たすため，$j \notin J$ のうち $\bold A^{j} \bold z^{\star} \gt 0$ である $j$ についてのみ考えます．  
  このような $j$ は $\epsilon \le \min_{j \notin J: A^{j} \bold z^{\star} \gt 0} \frac{c_j - \bold A^{j} \bold y}{\bold A^{j} \bold z^{\star}}$ を満たす必要があります．  
  $\epsilon$ は大きい方がいいので，この条件を満たす最大の値を $\epsilon$ として選びます．

## ハンガリアン法

Primal Dual Algorighm を使ってハンガリアン法を導出します．
頂点 $a$ と頂点 $b$ を結ぶ辺を $(a, b) \in E$ とし，その容量を $c_{ab}$ とします．簡単のため $\bold c \ge \bold 0$ とし完全マッチングが存在するものとします．

以下では，有向グラフを接続行列 $\bold A$ で表します．また，ノードの数を $n$，辺の数を $m$ とします．
二部グラフの最小重み完全マッチングを線形緩和した主問題と双対問題を定義します．

- 主問題

$$
\begin{aligned}
&\text{minimize} && \sum_{(a, b) \in E} c_{ab} x_{ab} \\
&\text{subject to}
&& \sum_{b:(a, b) \in E} x_{ab} = 1 &&& a \in A \\
& && \sum_{a:(a, b) \in E} x_{ab} = 1 &&& b \in B \\
& && x_{ab} \ge 0 &&& (a, b) \in E\\
\end{aligned}
$$

- 双対問題

$$
\begin{aligned}
&\text{maxiimize} && \sum_{a \in A} u_{a} + \sum_{b \in B} v_{b} \\
&\text{subject to}
&& u_{a} + v_{b} \le c_{ab} &&& (a, b) in E\\
\end{aligned}
$$

### ハンガリアン法の導出

1. 双対問題の適当な実行可能解を求めます．$C \ge 0$ を仮定しているため，$\bold u = \bold v = \bold 0$ とすることができます．
2. restricted primal を考えます．$J = \lbrace(a, b) \in E : u_{a} + v_{b} = c_{ab} \rbrace$ とすると以下のようになります．これは $J$ の辺のみを使って完全マッチングを求める問題です．

   - Restricted Primal
     $$
     \begin{aligned}
     &\text{minimize} && \sum_{a \in A} s_{a} + \sum_{b \in B} s_{b} \\\
     &\text{subject to}
     && \sum_{b:(a, b) \in E} x_{ab} + s_{a} = 1 &&& a \in A\\\
     & && \sum_{a:(a, b) \in E} x_{ab} + s_{b} = 1 &&& b \in B\\\
     & && x_{ab} >= 0 &&& (a, b) \in J \\\
     & && x_{ab} = 0　&&& (a, b) \in (E - J) \\\
     & && s \ge 0
     \end{aligned}
     $$

3. $J$ の辺のみをつかって完全マッチングを作ることができれば，RP の目的関数値を 0 にすることができます．
   辺の重みを考えなくてよくなったため，2 部グラフの最大マッチングを求めるアルゴリズムを使うことができます．
   もし完全マッチングがみつかればアルゴリズムは終了します．
4. 見つからない場合は dual restricted primal を考えます．DRP は $J$ の辺のみを使ったグラフ上で最小点被覆を求める問題です．これは RP で求めた最大マッチングの解を使って求めることができます ．

   - Dual Restricted Primal
     $$
     \begin{aligned}
     &\text{maximize} && \sum_{a \in A} u^{\prime}_{a} + \sum_{b \in B} v^{\prime}_{b} \\\
     &\text{subject to}
     && u^{\prime}_{a} + v^{\prime}_{b} \le 0 &&& (a, b) \in J \\\
     & && u^{\prime}_{a} \le 1 &&& a \in A\\\
     & && v^{\prime}_{b} \le 1 &&& b \in B
     \end{aligned}
     $$

5. DRP の解を求め，$u^{\prime \prime} = u + \epsilon u^{\prime}$，$v^{\prime \prime} = v + \epsilon v^{\prime}$とします．ここで $\epsilon = \min_{(a, b) \in (E - J)}(c_{ab} - u_{a} - v_{b})$ とすることができます．あとは，$u^{\prime}$ と $v^{\prime}$ を新しい双対問題の解として採用し，2 に戻ります．

## 参考文系

- [Combinatorial Optimization: Algorithms and Complexity](https://www.amazon.co.jp/dp/B00C8UQZAO/)
- [18.433 Combinatorial Optimization The Primal-dual Algorithm](https://ocw.mit.edu/courses/18-433-combinatorial-optimization-fall-2003/92c255b407a6ad7d75c9ea55de2fdf33_l15.pdf)
- [CHAPTER 4 THE PRIMAL-DUAL METHOD FOR APPROXIMATION ALGORITHMS AND ITS APPLICATION TO NETWORK DESIGN PROBLEMS](https://math.mit.edu/~goemans/PAPERS/book-ch4.pdf)