"use client";

import { useState } from "react";
import Button from '@mui/material/Button';

export default function ContactPage() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [status, setStatus] = useState("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault(); 

console.log({ name, email, message });

setStatus("お問い合わせありがとうございました！");

setName("");
setEmail("");
setMessage("");
};

return (
<div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", height: "100%" }}>
    <h1 style={{marginTop: "50px"}}>お問い合わせ</h1>
    <form onSubmit={handleSubmit}>
    {/* お名前の入力欄 */}
    <div style={{ marginBottom: "10px" }}>
        <label>お名前：</label>
        <input
            type="text"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            style={{ border: "solid 1px #ccc", width: "100%", padding: "8px", marginTop: "5px" }}
            required
        />
    </div>
    {/* メールアドレスの入力欄 */}
    <div style={{ marginBottom: "10px" }}>
        <label>
        メールアドレス：
        </label>
        <input
            type="email"
            value={email}
            maxLength={100}
            onChange={(e) => setEmail(e.target.value)}
            style={{ border: "solid 1px #ccc", width: "100%", padding: "8px", marginTop: "5px" }}
            required
        />
    </div>
    {/* メッセージの入力欄 */}
    <div style={{ marginBottom: "10px" }}>
        <label>
        メッセージ：
        <textarea
            value={message}
            maxLength={500}
            onChange={(e) => setMessage(e.target.value)}
            style={{ border: "solid 1px #ccc", width: "100%", padding: "8px", marginTop: "5px" }}
            rows={5}
            required
        />
        </label>
    </div>
    <Button variant="contained" type="submit" style={{ padding: "10px 20px" }}>
        送信
    </Button>
    </form>
    {/* 送信後のメッセージを表示 */}
    {status && <p style={{ color: "green", marginTop: "20px" }}>{status}</p>}
</div>
);
}
