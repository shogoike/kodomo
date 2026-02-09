import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心エコー Z値計算",
  description: "弁輪径のZ値計算ツール",
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
