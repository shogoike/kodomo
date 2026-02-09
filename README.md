# 心エコー Z値計算ツール

小児心エコー検査における弁輪径のZ値計算ツールです。

## 機能

- PHN/Lopez
- Pettersen 2008
- Boston (BCH/Colan系)
- Cantinotti (2014/2017)

上記4つの正規化式に基づいて、Z=0の弁輪径を計算します。

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
