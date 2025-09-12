+++
title = "Adwords に対する Primal-Dual の競合比解析"
date = 2025-09-12T00:00:00+09:00
draft = false
image = ""
categories = "組合せ最適化"
tags = ["adwords", "競合比", "online algorithm", "primal-dual"]
slug = "adwords-primal-dual"
+++

## Adwords

[Adwords に対する Primal-Dual を使った貪欲法の競合比解析](https://miti-7.github.io/post/adwords-greedy-primal-dual/) の続きです．  
以下では，adwords に対する primal dual algorithm が $1 - \frac{1}{e}$-competitive となることを示します．

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
  - 各 $u$ について，$\alpha_u \leftarrow 0$ とする
- $v$ が到着したとき，$\alpha_u \lt 1$ の中で $\mathrm{bid}_{uv}(1 - \alpha_u)$ を最大化する $u$ に $v$ を割り当てる
- $\alpha_u \ge 1$ ならなにもしない．そうでなければ
  - $u$ の残り予算から $\min(\mathrm{bid}_{uv}, 残り予算)$ 減算し，$x_{uv} \leftarrow 1$ とする
  - $\beta_v \leftarrow \mathrm{bid}_{uv}(1 - \alpha_u)$
  - $\alpha_u \leftarrow \alpha_u (1 + \frac{\mathrm{bid}_{uv}}{B_u}) + \frac{\mathrm{bid}_{uv}}{(c - 1) \cdot B_u}$

## 競合比解析

以下の 3 つを示します．
主問題の目的関数値と双対問題の目的関数値を $P$ と $D$ とし，$1$ イテレーションでの変化量をそれぞれ $\Delta P$ と $\Delta D$ で表します．  
また，$R_{\mathrm{max}} = \max_{u, v}{\frac{\mathrm{bid}_{uv}}{B_u}}$，$c = (1 + R_{\mathrm{max}})^{\frac{1}{R_{\mathrm{max}}}}$ とします．

1. 主問題の実行可能解を生成する
2. 双対問題の（ほぼ）実行可能解を生成する

   - 双対問題の予算制約を破ることがあるが，各 $u$ の超過は高々 $\max_{v} \mathrm{bid}_{uv}$
   - 得られる利益は $(1 - R_{\mathrm{max}})\sum_{uv} \mathrm{bid}_{uv} x_{uv}$ 以上となる

3. 各イテレーションで $\Delta P \le (1 + \frac{1}{c - 1}) \Delta D$
   - $\frac{\Delta D}{\Delta P} \ge 1 - \frac{1}{c}$

1.，2.，3.と弱双対性により上記のアルゴリズムの競合比は以下のようになります．
$$(1 - \frac{1}{c})(1 - R_{\mathrm{max}}) = (1 - \frac{1}{(1 + R_{\mathrm{max}})^{\frac{1}{R_{\mathrm{max}}}}})(1 - R_{\mathrm{max}})$$

これは，$R_{\mathrm{max}} \rightarrow 0^+$ のとき $1 - \frac{1}{e}$ に近づきます．

### 1. 主問題の実行可能解を生成する

主問題の制約条件は $(1)$ $\mathrm{bid}_{uv}(1 - \alpha_u) \leq \beta_v$，$(2)$ $\alpha_u \geq 0$，$(3)$ $\beta_{v} \geq 0$ の 3 つです．  
$(2)$ と $(3)$ は明らかに満たしているので，$(1)$ を満たすことを確認します．

$v$ が $u$ に割り当てられたときを考えます．

- $\alpha_u \ge 1$ の場合

  - $\mathrm{bid}_{uv} \ge 0$ かつ $\beta_v \ge 0$のため制約 $(1)$ を満たします．

- $\alpha_u \lt 1$ の場合
  - アルゴリズムで $\beta_v = \mathrm{bid}_{uv}(1 - \alpha_u)$となります．  
    このとき $u$ として $\mathrm{bid}_{u^{\prime} v}(1 - \alpha_{u^{\prime}})$ を最大化する $u^{\prime}$ を選んでいるため，任意の $u$, $v$ について制約 $(1)$ を満たします．  
    また，アルゴリズムでは $\alpha_i$ を単調増加させるため，この操作によって制約が満たされなくなることはありません．

### 2. 双対問題の(ほぼ)実行可能解を生成する

双対問題の制約条件は，$(1)$ $\sum_{v} \mathrm{bid}_{uv} x_{uv}  \le B_u$，$(2)$ $\sum_u x_{uv} \leq 1$，$(3)$ $x_{uv} \geq 0$ の 3 つです．  
$(2)$ と $(3)$ は明らかに満たしているので，$(1)$ を満たしていることを確認します．

まず，アルゴリズムは $\alpha \ge 1$ のとき双対変数を更新しないので，$u$ に対する課金額 $\sum_{v} \mathrm{bid}_{uv} x_{uv}$ が予算を超えたら場合 $\alpha_u \ge 1$ となることを示します．  
これは $\alpha_u \ge \frac{1}{c - 1}(c^{\frac{\sum \mathrm{bid}_{uv} x_{uv}}{B_u}} - 1)$ によって示されます．

$\alpha_u \ge \frac{1}{c - 1}(c^{\frac{\sum_{v} \mathrm{bid}_{uv} x_{uv}}{B_u}} - 1)$ を帰納法を使って証明します．  
$\alpha_u \ge \frac{1}{c - 1}(c^{\frac{\sum_{v} \mathrm{bid}_{uv} x_{uv}}{B_u}} - 1)$ を仮定します．はじめこの条件は明らかに満たされています．  
$k$ が $u$ に割り当てられたときの $\alpha_{u}$ の変化量を考えます．

$$
\begin{aligned}
\alpha_{u_{end}} &= \alpha_{u_{start}}(1 + \frac{\mathrm{bid}_{uk}}{B_u}) + \frac{\mathrm{bid}_{uk}}{(c - 1)B_u} \\
            &\ge \frac{1}{c - 1} [c^{\frac{\sum_{v \in V \backslash \{k\}} \mathrm{bid}_{uv} x_{uv}}{B_u}} - 1](1 + \frac{\mathrm{bid}_{uk}}{B_u}) + \frac{\mathrm{bid}_{uk}}{(c - 1)B_u} \\
            &= \frac{1}{c - 1}[c^{\frac{\sum_{v \in V \backslash \{k\}} \mathrm{bid}_{uv} x_{uv}}{B_u}}(1 + \frac{\mathrm{bid}_{uk}}{B_u}) - 1] \\
            &\ge \frac{1}{c - 1}[c^{\frac{\sum_{v \in V \backslash \{k\}} \mathrm{bid}_{uv} x_{uv}}{B_u}} c^{\frac{\mathrm{bid}_{uk}}{B_u}} - 1] \\
            &= \frac{1}{c - 1}[c^{\frac{\sum_{v} \mathrm{bid}_{uv} x_{uv}}{B_u}} - 1]
\end{aligned}
$$

<details><summary>補足</summary><div>

---

$2$ つめの不等式は帰納法の仮定から導かれます．  
$4$ つめの不等式が成り立つことを示すために，$1 + \frac{\mathrm{bid}_{uk}}{B_u} \ge c^{\frac{\mathrm{bid}_{uk}}{B_u}}$ を示します．  
$0 \le x \le y \le 1$ のとき，$\frac{\ln(1 + x)}{x} \ge \frac{\ln(1 + y)}{y}$ となることを利用します．  
ここで，$x = \frac{\mathrm{bid}(uk)}{B_u} \le R_{\mathrm{max}} = y$ とおくと，
$$\frac{\ln(1 + x)}{x} \ge \frac{\ln(1 + R_{\mathrm{max}})}{R_{\mathrm{max}}} = \ln((1 + R_{\mathrm{max}})^{\frac{1}{R_{\mathrm{max}}}}) = \ln c$$
両辺を $x$ 倍して指数をとると $1 + x \ge c^{x}$ となることから $1 + \frac{\mathrm{bid}_{uk}}{B_u} \ge c^{\frac{\mathrm{bid}_{uk}}{B_u}}$ が示せました．  
また，$\frac{\mathrm{bid}_{uk}}{B_u} = R_{\mathrm{max}}$ のとき，この不等式は等式で成り立ちます．そのため，$c = (1 + R_{\mathrm{max}})^{\frac{1}{R_{\mathrm{max}}}}$ としているのでした．

---

</div></details>

次に，予算をどれくらい超えるかを考えます．  
アルゴリズムでは各 $u$ について予算制約を破る回数は高々 $1$ 回です．  
よって $\sum_{v} \mathrm{bid}_{uv} x_{uv} \leq B_{u} + \max_{v} \mathrm{bid}_{uv}$ を満たします．

$[\sum \mathrm{bid}_{uv} x_{uv}] \frac{B_u}{B_u + \max \mathrm{bid}_{uv}} \ge [\sum \mathrm{bid}_{uv} x_{uv}] (1 - R_{\mathrm{max}})$  
よって $(1 - R_{\mathrm{max}})$ をかけることにより確保できる利益の下界がわかります．

### 3. 各イテレーションで $\Delta P \le (1 + \frac{1}{c - 1}) \Delta D$

$\alpha_u \ge 1$ のときはどちらの目的関数値も変化しないので，$\alpha_u \lt 1$ のときを考えます

$\Delta P$  
$\alpha_u \leftarrow \alpha_u (1 + \frac{\mathrm{bid}_{uv}}{B_u}) + \frac{\mathrm{bid}_{uv}}{(c - 1) \cdot B_u}$，$\beta_v \leftarrow \mathrm{bid}_{uv}(1 - \alpha_u)$ とするので

$$
\begin{aligned}
\Delta P &= B_{u} \Delta \alpha_u + \Delta \beta_v \\
&= B_u(\frac{\mathrm{bid}_{uv} \alpha_u} {B_u} + \frac{\mathrm{bid}_{uv}}{(c - 1)B_{u}}) + \beta_v \\
&= \mathrm{bid}_{uv} \alpha_u + \frac{\mathrm{bid}_{uv}}{c - 1} + \mathrm{bid}_{uv}(1 - \alpha_u) \\
&= \mathrm{bid}_{uv} \alpha_u + \frac{\mathrm{bid}_{uv}}{c - 1} + \mathrm{bid}_{uv} - \mathrm{bid}_{uv} \alpha_u \\
&= \mathrm{bid}_{uv}(1 + \frac{1}{c - 1})
\end{aligned}
$$

$\Delta D$  
$x_{uv} \leftarrow 1$ とするので

$$
\begin{aligned}
\Delta D &= \mathrm{bid}_{uv} \Delta x_{uv} \\
&= \mathrm{bid}_{uv}
\end{aligned}
$$

よって，$\Delta P \le (1 + \frac{1}{c - 1}) \Delta D$ が示せました．

## 参考

- [Online Primal-Dual Algorithms for Maximizing Ad-Auctions Revenue](https://link.springer.com/chapter/10.1007/978-3-540-75520-3_24)
- [The Design of Competitive Online Algorithms via a Primal-Dual Approach](https://ieeexplore.ieee.org/document/8186915)
- [Online Matching and Ad Allocation](https://research.google/pubs/online-matching-and-ad-allocation/)
