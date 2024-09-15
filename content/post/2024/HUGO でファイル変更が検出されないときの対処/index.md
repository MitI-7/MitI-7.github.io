+++
title = "HUGO でファイル変更が検出されないときの対処"
date = 2024-09-15T00:00:00+09:00
draft = false
tags = ["HUGO"]
+++

hugo ではサーバーの実行中にファイルが変更されるとサイトを再構築し自動的にブラウザを更新してくれる機能があるのですが
，[Frequently asked questions](https://gohugo.io/troubleshooting/faq/#why-isnt-hugos-development-server-detecting-file-changes) によると WSL で実行しているときはうまく動作しないことがあるらしいです．  
このようなときは server を起動するときに，[poll オプション](https://gohugo.io/commands/hugo_server/)を指定すると定期的にポーリングしてくれます．

```
hugo server --poll "700ms"
```
