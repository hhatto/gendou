# gendou(temporary name)

Template repository for using TypeScript

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

## コアツールインストール

Azure Functions をローカルで動作させるために、下記コマンドでツールをインストールする。

```
brew tap azure/functions
brew install azure-functions-core-tools@3
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
WEB3_URL: web3.js に渡す URL
DISCORD_WEBHOOK_URL_INFO：Discord に info 情報を通知するための URL
DISCORD_WEBHOOK_URL_WARNING：Discord に warning 情報を通知するための URL
DISCORD_WEBHOOK_URL_ERROR：Discord に error 情報を通知するための URL

```

## azurite 起動

Time Trigger などで必要なツールを別画面などで起動する。

```
azurite -l ~/azurite
```

## Azure Functions 起動

下記コマンドで Azure Functions が稼働する。

```
npm start
```

今すぐテスト実行したいときは下記コマンドを実行するといい

```
market-factory-createを実行したい場合

curl --request POST -H "Content-Type:application/json" --data '{}' http://localhost:7071/admin/functions/market-factory-create

host.jsonに

	"functions": ["dev-property-transfer"]

と記載すると指定した関数のみ起動するため、便利
```

## テーブル定義の追加

local_test/docker/db/init 　以下に create の SQL 文を追加する
entities 　以下に テーブル定義を追加する

あとは他の関数をみてよしなにやってください。

参考
https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres

モデル書いて
npx prisma migrate dev --name init
で SQL 作成さレテ適用される

readme 直して、git actions どうにかする
lint走るようにする


V1とか入れる
