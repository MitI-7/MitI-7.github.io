+++
title = "Adwords に対する貪欲法の競合比解析"
date = 2025-09-12T00:00:00+09:00
draft = false
image = ""
categories = "組合せ最適化"
tags = ["adwords", "競合比", "online algorithm"]
slug = "adwords-greedy"
+++

## Adwords

広告主の集合 $U$ と広告リクエストの集合 $V$ があります．
各広告主 $u$ は予算 $B_{u}$ を持ちます．広告リクエストは逐次到着し，各広告主は各広告リクエストに対して入札額 $\mathrm{bid}_{uv}$ を設定します．  
各広告リクエストが到着するたびに，そのリクエストを一人の広告主に割り当てるか，誰にも割り当てないかを即時に決定します．  
割り当てが行われた場合，その広告主の残り予算は $\min(\mathrm{bid}_{uv}, B_{u} - S_{u})$ 減少します．ここで $S_{u}$ は広告主 $u$ の予算消化額です．  
全てのリクエストに対して割り当てを決定し，広告主の予算制約を超えない範囲で割り当てられた広告リクエストの入札額の合計を最大化することが目的です．

以下では，adwords に対する貪欲法が $\frac{1}{2}$-competitive となることを示します．

## アルゴリズム

- $v$ が到着したとき
  - 予算が残っている $u$ がない場合は，どの $u$ にも割り当てない．
  - 予算が残っている $u$ について，$\widehat{\mathrm{bid}_{uv}} = \min\{\mathrm{bid}_{uv}, B_u - S_u\}$ とし，もっとも $\widehat{\mathrm{bid}_{uv}}$ が高い $u$ に $v$ を割り当てる

## 証明

以下のように定義します.

- $\mathrm{OPT}$: 最適解の目的関数値
- $\mathrm{ALG}$: Greedy の目的関数値
- $\mathrm{opt}_v$: 最適解において，$v$ によって得られる収益
- $\mathrm{alg}_v$: Greedy において，$v$ によって得られる収益

$\mathrm{OPT} - \mathrm{ALG} \le \mathrm{ALG}$ を示します．  
この式が成り立つと，$\mathrm{OPT} \le 2\mathrm{ALG}$ となり，$\frac{1}{2} \mathrm{OPT} \le \mathrm{ALG}$ を示すことができます．

まず，$\mathrm{OPT} - \mathrm{ALG}$ の上界を求めます．  
Greedy が最適解に比べて低い金額で採用してしまった $v$ の集合を $V^{\prime} = \lbrace v : \mathrm{alg}_v \lt \mathrm{opt}_v \rbrace$ と定義し，
$\mathrm{Loss} = \sum_{v \in V^{\prime}} (\mathrm{opt}_v - \mathrm{alg}_v)$ とします．  
$\mathrm{alg}_v \ge \mathrm{opt}_v$ であるような $v$ を無視しているので，$\mathrm{Loss}$ は $\mathrm{OPT} - \mathrm{ALG}$ の上界です．  
よって，以下のようになります．

$$
\begin{equation}
\mathrm{OPT} - \mathrm{ALG} = \sum_{v \in V} (\mathrm{opt}_v - \mathrm{alg}_v) \le \sum_{v \in V^{\prime}} (\mathrm{opt}_v - \mathrm{alg}_v) = \mathrm{Loss}
\end{equation}
$$

次に，$\mathrm{Loss} \le \mathrm{ALG}$ を示します．$\mathrm{ALG} = \sum_u S_u$ を利用します．  
証明しやすいように，$\mathrm{Loss}$ を広告主で分割します．  
$V^{\prime}$ のうち最適解で $u$ に割り当てられた広告リクエストの集合を $V^{\prime}_u$ とすると，$\mathrm{Loss}_u = \sum_{v \in V^{\prime}_u} (\mathrm{opt}_v - \mathrm{alg}_v)$ となります．

$v \in V^{\prime}_u$ が到着したときを考えます．$v$ は最適解では $u$ に，Greedy では $u^{\prime}$ に割り当てられたとします．  
$v$ が到着した時点で，Greedy が $u$ ではなく $u^{\prime}$ を選んだということは，その時点での $u$ の修正済み入札額 が $u^{\prime}$ の修正済み入札額以下だったということです．つまり，$u$ の残り予算は高々 $alg_v$ だったということになります．  
よって，任意の $v \in V^{\prime}_u$ について $S_u \ge B_u - alg_v$ となります．$B_u$ について整理すると, $B_u \le S_u + \mathrm{alg}_v$ です．

これまでの議論によって以下が示せます．

$$
\begin{aligned}
\mathrm{Loss}_u &= \sum_{v \in V^{\prime}_u} (\mathrm{opt}_v - \mathrm{alg}_v) \\
\mathrm{Loss}_u &= \sum_{v \in V^{\prime}_u} \mathrm{opt}_v - \sum_{v \in V^{\prime}_u} \mathrm{alg}_v \\
\mathrm{Loss}_u &\le B_u - \sum_{v \in V^{\prime}_u} \mathrm{alg}_v \\
\mathrm{Loss}_u &\le S_u + \mathrm{alg}_{v} - \sum_{v \in V^{\prime}_u} \mathrm{alg}_v \\
\mathrm{Loss}_u &\le S_u
\end{aligned}
$$

3 つ目の式への変形は，$\sum_{v \in V^{\prime}_u} \mathrm{opt}_v \le B_u$ を利用しています．  
5 つ目の式への変形は，$V^{\prime}_u = \emptyset$ の場合は $\mathrm{Loss}_u = 0$ が，$V^{\prime}_u \ne \emptyset$ の場合は任意の $v^{\star} \in V^{\prime}_u$ について $\mathrm{alg}_{v^{\star}} \le \sum_{v \in V^{\prime}_u} \mathrm{alg}_v$ が成り立つことを利用しています．
最後の式を $U$ について合計すると，以下の式が成り立ちます．

$$
\begin{equation}
\mathrm{Loss} = \sum_u \mathrm{Loss}_u \le \sum_u S_u = \mathrm{ALG}
\end{equation}
$$

式 (1) と式 (2) から，$\mathrm{OPT} - \mathrm{ALG} \le \mathrm{Loss} = \mathrm{ALG}$ となり，$OPT - ALG \le ALG$ が示せました．

## 参考

- [Online Matching and Ad Allocation](https://research.google/pubs/online-matching-and-ad-allocation/)
