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
