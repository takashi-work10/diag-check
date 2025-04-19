import type { Metadata } from "next";
import Providers from './providers';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';


export const metadata: Metadata = {
  title: "英検学習タイプ診断",
  description: "あなたに一番効率的な英検学習方法が分かります。",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}