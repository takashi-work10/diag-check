import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>DBテスト</div>
      <Link href="/posts"
          style={{
            display: "inline-block",
            fontSize: "24px",
            padding: "16px 32px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none"
          }}>
          投稿一覧へ移動
      </Link>
    </div>
  );
}
