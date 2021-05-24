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
パスワード:testpassword
```

## 環境変数

設定するファイルは local.settings.json。下記の 4 つ以外はそのままで大丈夫。

```
DATABASE_URL:DBのURL
BASE_DATE:検索基準日、「YYYY-MM-DD」形式で指定する。検索基準日と検索基準日+1年が検索期間となる
GITHUB_API_TOKEN:GitHubのGraphQLを実行するときに利用するトークン。公開情報しか取得しないので、何も権限を持たないPATで大丈夫
GITHUB_CLIENT_ID:GitHub OAuthのクライアントID
GITHUB_CLIENT_SECRETS:GitHub OAuthのクライアントシークレットID
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

パラメータに指定した github id に該当する報酬情報を取得します。

URL:https://{domain}/v1/info/{github_id}<br>
method:get<br>
例）curl http://localhost:7071/v1/info/github-id1<br>

### パラメータ

github_id:GitHub のユーザ ID

### レスポンス

reward:報酬額、整数のため、実際に付与される報酬額に 10\*18 をかけた数字が帰ってくる<br>
is_rank_down:報酬額がランクダウンしている場合は true、そうでない場合は false。枠が埋まってしまったとき、ワンランク下の報酬が付与される時がある、そのステータス。<br>
find_at:claim url を初めて返却した時の日時、未返却の場合は null が入っている

## findClaimUrl

パラメータに設定した github id に該当するクレーム用 URL を返却します。

URL:http://{domain}/v1/findClaimUrl<br>
method:post<br>
例）curl -X POST -d '{"code":"abcde......"}' http://localhost:7071/v1/findClaimUrl<br>

### パラメータ

code:GitHub OAuth 認証後に発行されるコード

### レスポンス

reward:報酬額、整数のため、実際に付与される報酬額に 10\*18 をかけた数字が帰ってくる<br>
is_rank_down:報酬額がランクダウンしている場合は true、そうでない場合は false。枠が埋まってしまったとき、ワンランク下の報酬が付与される時がある、そのステータス。<br>
find_at:claim url を初めて返却した時の日時、未返却の場合は null が入っている<br>
github_id:パラメータの code に紐づく GitHub のユーザ ID<br>
