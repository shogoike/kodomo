# 心エコー Z値計算ツール

小児心エコー検査における弁輪径のZ値を計算するオンラインツールです。

## 機能

### 対応している計算方法
- **PHN/Lopez**: 体重の平方根を用いた線形回帰式
- **Pettersen 2008**: BSAを用いた線形回帰式
- **Boston (BCH/Colan)**: BSAの平方根を用いた線形回帰式
- **Cantinotti (2014/2017)**: BSAの平方根を用いた線形回帰式

### 対応している弁/血管
- 大動脈弁
- 僧帽弁
- 肺動脈弁
- 三尖弁
- LPA（左肺動脈）
- RPA（右肺動脈）

### 表示内容
- 4つの計算方法 × 6つの弁/血管 = 24通りの結果を一度に表示
- 計算過程の詳細表示（BSA、√BSA、√体重など）
- 使用した係数の詳細表示
- モバイル対応のレスポンシブデザイン

## 使い方

### 開発サーバーの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 本番ビルド

```bash
npm run build
npm start
```

## 注意事項

このツールは参考値を提供するものです。実際の臨床判断には、必ず文献の原著や専門家の意見を参照してください。

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Vercelへのデプロイ

### 方法1: Vercelダッシュボードから（推奨）

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでログイン
3. "Add New..." → "Project" をクリック
4. GitHubリポジトリを選択
5. "Deploy" をクリック

自動的にビルドとデプロイが実行されます。今後のGitHubへのpushも自動的にデプロイされます。

### 方法2: Vercel CLIを使用

```bash
npm install -g vercel
vercel login
vercel --prod
```

## SEO対策

このプロジェクトには以下のSEO対策が含まれています：

- メタデータの最適化（タイトル、説明、キーワード）
- Open Graphタグ
- robots.txt（自動生成）
- sitemap.xml（自動生成）

### Google Search Consoleへの登録

1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. プロパティを追加: `https://kodomo-zeta.vercel.app`
3. 所有権の確認
4. サイトマップを送信: `https://kodomo-zeta.vercel.app/sitemap.xml`

## デプロイURL

本番環境: https://kodomo-zeta.vercel.app
