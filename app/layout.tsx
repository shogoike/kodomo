import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "弁輪計算 | 小児心臓弁輪径Z値オンライン計算",
  description: "小児心エコー検査における弁輪径を計算します。PHN/Lopez、Pettersen 2008、Boston (BCH/Colan)、Cantinotti (2014/2017) の4つの正規化式に対応。大動脈弁、僧帽弁、肺動脈弁、三尖弁、LPA、RPAの計算が可能です。",
  keywords: ["弁輪計算", "心エコー", "Z値", "弁輪径", "小児", "心臓", "超音波検査", "PHN", "Lopez", "Pettersen", "Boston", "Cantinotti", "大動脈弁", "僧帽弁", "肺動脈弁", "三尖弁", "LPA", "RPA"],
  authors: [{ name: "shogoike" }],
  openGraph: {
    title: "弁輪計算 | 小児心臓弁輪径Z値オンライン計算",
    description: "小児心エコー検査における弁輪径を計算します。4つの正規化式に対応した無料オンラインツール。",
    type: "website",
    locale: "ja_JP",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
