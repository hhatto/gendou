# gendou(temporary name)

send functions

# Stack

- npm client is [yarn](https://github.com/yarnpkg/yarn)
- Testing is [ava](https://github.com/avajs/ava)
- Linting is [eslint](https://github.com/eslint/eslint)
- Basic lint rule set is [eslint-plugin-functional](https://github.com/jonaskello/eslint-plugin-functional)
- Formatter is [prettier](https://github.com/prettier/prettier)
- Pre-install utility is [ramda](https://github.com/ramda/ramda)

# Usage

Create a repository using this template; just runs following command.

```bash
yarn
```

## DB セットアップ

テスト時、データを保存するためのデータベースをローカルに構築する。事前に docker desktop など、docker が稼働する環境の構築を完了しておくこと。

```
cd docker
docker-compose up -d
```

下記コマンドで DB に接続することができる

```
psql postgresql://testuser@localhost:5432/testdb
パスワード：testpassword
```

## 環境変数

設定するファイルは local.settings.json。下記の 4 つ以外はそのままで大丈夫。

```
DATABASE_URL: DBのURL
```

## Azure Functions 起動

下記コマンドで Azure Functions が稼働する。

```
npm start
```

## テーブル定義の追加

prisma/schema.prisma にテーブル定義を記述して

npx prisma migrate dev --name init

を実行するとテーブル SQL が作成される

GitHub Actions で利用するので、docker/db/init 　以下に移動させておくこと

参考
https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres

# api interface
## info
パラメータに指定したgithub idに該当する報酬情報を取得します。

URL：https://{domain}/v1/info/{github_id}<br>
method：get<br>
例）curl http://localhost:7071/v1/info/github-id1<br>

レスポンス<br>
reward：報酬額、整数のため、実際に付与される報酬額に10*18をかけた数字が帰ってくる<br>
find_at：claim urlを初めて返却した時の日時、未返却の場合はnullが入っている

## findClaimUrl
パラメータに設定したgithub idに該当するクレーム用URLを返却します。

URL：http://{domain}/v1/findClaimUrl<br>
method:post<br>
例）curl -X POST -d '{"github_id":"git-id1", "signature":"0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c", "address":"0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943"}' http://localhost:7071/v1/findClaimUrl<br>

レスポンス<br>
reward：報酬額、整数のため、実際に付与される報酬額に10*18をかけた数字が帰ってくる<br>
claim_url：発行されたclaim url
