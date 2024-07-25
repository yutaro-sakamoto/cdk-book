メモです

# CDKのプロジェクトの作成後にやること

eslintとprettierのインストール
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript-eslint
npm install --save-dev --save-exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
```
`eslint.config.mjs`に下記の設定を書く
```typescript
 // @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
);
```
`package.json`に下記のような記述を追加する

```js
  "scripts": {
    // 途中は割愛
    "lint": "eslint bin/ lib/",
    "check-lint": "eslint --fix-dry-run bin/ lib/",
    "format": "prettier --ignore-path .gitignore --write '+(bin|lib)/*.+(js|ts|json)'",
    "check-format": "prettier --check --ignore-path .gitignore '+(bin|lib)/*.+(js|ts|json)'"
  },
```

.git/hook/pre-commitに下記の内容を書き込み、`chmod +x .git/hook/pre-commit`を実行して実行権限をつける
```bash
npm run format
git add -u
```

GitHub Actionsの設定を行う
```yaml
name: test 
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4

      - name: npm ci
        run: npm ci

      - name: Format
        run: npm run check-format

      - name: ESLint
        run: npm run check-lint
```

# コンテナをデプロイする際の注意

WSL2上でWindowsのDockerが使用されている状況では、
EC2のためにWSL2上でビルドしたDockerコンテナをデプロイすることには失敗した。
そこで、WSL2上にDockerをインストールすることで解決した。

* https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
* https://medium.com/@praveenadoni4456/error-got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket-at-e68bfab8146a

# test

* Assersion test
* Snapshot test
  * 前回のCDKの出力をJSON形式で保存しておき、次回のテスト結果と比較する

# debug
.vscode/launch.jsonに下記の設定を追加する
```json
{
  "version": "0.2.0",
  "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "Debug CDK",
        "skipFiles": [
            "<node_internals>/**"
        ],
        "runtimeArgs": [
            "-r", "./node_modules/ts-node/register/transpile-only"
        ],
        "args": [
            "${workspaceFolder}/bin/chapter-6.ts"
        ],
        "env": {
          "CDK_MODE": "ONLY_DEV",
          "CDK_DEFAULT_ACCOUNT": "123456789123",
          "NODE_ENV": "Development",
          "CDK_DEFAULT_REGION": "us-east-1"
        }
      }
  ]
}
```

# Chapter 07
* AwsCustomResource
  * https://qiita.com/skrir/items/71423b3508d8e72d3f87
* CallAwsService
  * StepFunctionsで使う

# Chapter 08
LocalStackでローカル環境でテストを実行できる。
しかし、LocalStackは完全にAWSのサービスをエミュレートするわけではない。
AWS SAMといった他の選択肢もある。
# その他

* S3のpublic access blockを有効にしていると、CDKのデプロイが失敗することがある
* 依存ライブラリのバージョンが古いとデプロイに失敗する場合がある。yarn upgrade --latestを実行することで解決することがある

# 参考リンク

* [組織内での AWS CDK 利用拡大のためのベストプラクティス](https://aws.amazon.com/jp/blogs/news/best-practices-for-scaling-aws-cdk-adoption-within-your-organization/)
* [AWS CDKベストプラクティス](https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/best-practices.html)
* [CDK Pipelines for GitHub Workflows](https://github.com/cdklabs/cdk-pipelines-github)
* [AWS Deployment Pipeline Reference Architecture](https://pipelines.devops.aws.dev/application-pipeline/index.html)
* Policy as Code
  * [AWS CloudFormation Guard](https://github.com/aws-cloudformation/cloudformation-guard)
  * [Open Policy Agent](https://github.com/open-policy-agent/opa)
* [AWS re:Invent 2022 - Governance and security with infrastructure as code (DOP314) ](https://www.youtube.com/watch?v=7cYzYWcDyiM)
* [AWS CloudFormation Hooks](https://docs.aws.amazon.com/ja_jp/cloudformation-cli/latest/hooks-userguide/what-is-cloudformation-hooks.html)
* [CDK Monitoring Constructs](https://github.com/cdklabs/cdk-monitoring-constructs)
* [CDKWakeful](https://github.com/aws-samples/cdk-wakeful)
* [CDK CFN Guard Validator Plugin](https://github.com/cdklabs/cdk-validator-cfnguard)
* [DevSecOps とは何ですか?](https://aws.amazon.com/jp/what-is/devsecops/)
* [Building end-to-end AWS DevSecOps CI/CD pipeline with open source SCA, SAST and DAST tools](https://aws.amazon.com/jp/blogs/devops/building-end-to-end-aws-devsecops-ci-cd-pipeline-with-open-source-sca-sast-and-dast-tools/)
* [Construct Hub](https://constructs.dev/)