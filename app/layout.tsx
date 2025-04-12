import type { Metadata } from "next";
import Providers from './providers';
import Header from "../components/Header";
import Footer from "../components/Footer";


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
      <Header />
          {children}
      </Providers>
      <Footer />
      </body>
    </html>
  );
}
