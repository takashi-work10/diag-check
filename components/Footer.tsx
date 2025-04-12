    "use client";

    import React from "react";
    import Button from "@mui/material/Button";
    import { FaTwitter, FaFacebookF } from "react-icons/fa";

    const Footer: React.FC = () => {
    // 今のページのURLを取得（ブラウザで実行される場合のみ）
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareUrl = encodeURIComponent(currentUrl);
    const shareText = encodeURIComponent("このページを見てね！");

    // SNSにシェアするためのリンクを作って新しいタブで開く関数
    const share = (platform: "twitter" | "facebook") => {
        let url = "";
        if (platform === "twitter") {
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        } else if (platform === "facebook") {
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <footer
        style={{
            padding: "30px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
        }}
        >
        <p
            style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "20px",
            }}
        >
            このページをシェアしてね！
        </p>
        <Button
            variant="contained"
            onClick={() => share("twitter")}
            style={{
            margin: "10px",
            borderRadius: "20px",
            backgroundColor: "#1DA1F2",
            color: "#fff",
            fontWeight: "bold",
            }}
            startIcon={<FaTwitter />}
        >
            X
        </Button>
        <Button
            variant="contained"
            onClick={() => share("facebook")}
            style={{
            margin: "10px",
            borderRadius: "20px",
            backgroundColor: "#3b5998",
            color: "#fff",
            fontWeight: "bold",
            }}
            startIcon={<FaFacebookF />}
        >
            Facebook
        </Button>
        </footer>
    );
    };

    export default Footer;
