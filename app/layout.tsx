import type { Metadata } from "next";
import Providers from './providers';


export const metadata: Metadata = {
  title: "英検学習タイプ診断",
  description: "あなたに一番効率的な英検学習方法が分かります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
      <Providers>
      <header>
      </header>
          {children}
      </Providers>
      </body>
    </html>
  );
}
