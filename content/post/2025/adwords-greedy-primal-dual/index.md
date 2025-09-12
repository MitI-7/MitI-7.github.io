+++
title = "Adwords に対する Primal-Dual を使った貪欲法の競合比解析"
date = 2025-09-12T00:00:00+09:00
draft = false
image = ""
categories = "組合せ最適化"
tags = ["adwords", "競合比", "online algorithm", "primal-dual"]
slug = "adwords-greedy-primal-dual"
+++

## Adwords

[Adwords に対する貪欲法の競合比解析](https://miti-7.github.io/post/adwords-greedy/) の続きです．  
以下では，adwords に対する貪欲法が $\frac{1}{2}$-competitive となることを primal-dual を使って示します．

## Small Bids Assumption

予算に対する入札額の比率のうち最大を $R_{\mathrm{max}}$ とし，$R_{\mathrm{max}}$ は十分小さいと仮定します．  
$R_{\mathrm{max}} \coloneqq \max_{u, v} \frac{\mathrm{bid}_{uv}}{B_u}$

## Adwords の定式化

Adwords の主問題と双対問題は以下のようになります．ここでは adwords を双対問題とします．  
$x_{uv}$ は $v$ が $u$ に割り当てられたときに $1$ になる決定変数です．実際には広告リクエストは分割できないので $x_{uv} \in \lbrace 0, 1 \rbrace$ ですが線形緩和しています．

主問題(Primal Problem)

$$
\begin{aligned}
&\text{minimize} && \sum_{u} B_u \alpha_{u} + \sum_{v} \beta_v \\
&\text{subject to}
&& \mathrm{bid}_{uv}(1 - \alpha_u) \leq \beta_v && \forall u, v  \\
& && \alpha_u \geq 0 \\
& && \beta_{v} \geq 0
\end{aligned}
$$

双対問題(Dual Problem)

$$
\begin{aligned}
&\text{maximize} && \sum_{u, v} \mathrm{bid}_{uv} x_{uv} \\
&\text{subject to}
&& \sum_{v} \mathrm{bid}_{uv} x_{uv} \le B_u && \forall u  \\
& && \sum_u x_{uv} \leq 1 && \forall v \\
& && x_{uv} \geq 0
\end{aligned}
$$

## アルゴリズム

- 初期化
  - $x_{uv} \leftarrow 0$，$\alpha_u \leftarrow 0$，$\beta_v \leftarrow 0$ とする  
    $\alpha_u$ は $u$ が予算を使い切ったときに $1$ になる変数である．
- $v$ が到着したとき
  - $\alpha_u = 0$ であるような $u$ （つまり予算を使い切っていない $u$）のうち，$\mathrm{bid}_{uv}$ が最も高い $u^{\prime}$ に $v$ を割り当て，$\beta_v = \mathrm{bid}_{u^{\prime}v}$，$x_{u^{\prime}v} = 1$ とする
  - この割り当てで $u^{\prime}$ の予算が $0$ になった場合は，$\alpha_{u^{\prime}} = 1$ とする

## 競合比解析

以下の不等式が成り立つことを示します．

$$\mathrm{ALG} = \mathrm{Dual} \ge \frac{1}{2} \mathrm{Primal} \ge \frac{1}{2} \mathrm{Primal}^{\star} \ge \frac{1}{2} \mathrm{OPT}$$

ここで，$\mathrm{Primal}$ と $\mathrm{Dual}$ はアルゴリズムで構築される主問題と双対問題の目的関数値，$\mathrm{Primal}^{\star}$ は主問題の最適解の目的関数値，$\mathrm{OPT}$ は整数問題の最適解の目的関数値です．  
以下の 3 つを示します．

1. 主問題の実行可能解を生成する
2. 双対問題の実行可能解を生成する
3. $\mathrm{Dual} \ge \frac{1}{2} \mathrm{Primal}$

### 1. 主問題の実行可能解を生成する

主問題の制約条件は $(1)$ $\mathrm{bid}_{uv}(1 - \alpha_u) \leq \beta_v$，$(2)$ $\alpha_u \geq 0$，$(3)$ $\beta_{v} \geq 0$ の 3 つです．  
$(2)$ と $(3)$ は明らかに満たしているので，$(1)$ を満たしていることを確認します．

$\alpha_u = 1$ のとき，$\mathrm{bid}_{uv} (1 - \alpha_u) \le \beta_v$ を満たします．  
$\alpha_u = 0$ のとき，$\beta_{v} \ge \mathrm{bid}_{uv}$ となることを確認します．  
アルゴリズムは $v$ を $\mathrm{bid}_{uv}$ が最も高くなるような $u^{\prime}$ に割り当て，$\beta_v = \mathrm{bid}_{u^{\prime}v}$ とするので，$\beta_{v} \ge \mathrm{bid}_{uv}$ を満たします．

### 2. 双対問題の実行可能解を生成する

双対問題の制約条件は，$(1)$ $\sum_{v} bid_{uv} x_{uv}  \le B_u$，$(2)$ $\sum_u x_{uv} \leq 1$，$(3)$ $x_{uv} \geq 0$ の 3 つです．  
$(2)$ と $(3)$ は明らかに満たしているので，$(1)$ を満たしていることを確認します．

アルゴリズムでは，予算の残っている $u$ にのみ $v$ を割り当てているので，基本的には制約条件を満たします．  
厳密には，$v$ を $u$ に割り当てるとき，$u$ の残り予算が $\mathrm{bid}_{uv}$ に満たない場合でも割り当てることができ予算制約を破る可能性がありますが，small-bids assumption によって競合比には影響しません．

### 3. $\mathrm{Dual} \ge \frac{1}{2} \mathrm{Primal}$

$v$ を $u$ に割り当てるたび，$\mathrm{Primal}$ も $\mathrm{Dual}$ も $\mathrm{bid}_{uv}(=\beta_v)$ だけ目的関数値が増加します．  
また，$\mathrm{Primal}$ は予算を使い切ったとき $\alpha_u = 1$ となり $B_u$ 増加します．この $B_u$ は $u$ に割り当てられた $bid_{uv}$ の合計なので，$\alpha_u = 1$となるような $B_u$ の合計は高々 $\mathrm{Dual}$ となります．  
よって，全体として $\mathrm{Primal} \le \mathrm{Dual} + \mathrm{Dual} = 2 \mathrm{Dual}$ なので，$\mathrm{Dual} \ge \frac{1}{2} \mathrm{Primal}$ となります．

今回の解析では $v$ を $u$ に割り当てるとき，$u$ の残り予算が $\mathrm{bid}_{uv}$ に満たない場合でも $\mathrm{bid}_{uv}$ を計上しています．  
よって厳密には高々 $\sum_{u} \max_{v} \mathrm{bid}_{uv}$ を過大に計上していますが，small bids assumption によって，競合比には影響しません．

## 参考

- [Online Matching and Ad Allocation](https://research.google/pubs/online-matching-and-ad-allocation/)
