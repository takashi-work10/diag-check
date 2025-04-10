"use client";

import Link from "next/link";
import Button from "@mui/material/Button";

export default function HomePage() {
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          maxWidth: "600px",
          padding: "40px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20vh", 
          marginBottom: "30vh",
        }}
      >
        <h1 style={{ fontSize: "36px", color: "#FF6F91" }}>診断テスト</h1>
        <p style={{ fontSize: "20px", marginBottom: "40px", color: "#555" }}>
          診断テストへようこそ。下のボタンを押して、楽しく診断テストを始めましょう！
        </p>
        <Link href="/diagnosis" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              fontSize: "24px",
              backgroundColor: "#CF9FFF",
              color: "#fff",
              padding: "10px 30px",
              borderRadius: "30px",
              textTransform: "none",
            }}
          >
            診断テストを始める →
          </Button>
        </Link>
      </div>
    </div>
  );
}
