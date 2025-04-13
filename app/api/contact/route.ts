import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "すべての項目（お名前、メールアドレス、メッセージ）が必要です。" },
                { status: 400 }
            );
        }
        const newContact = await prisma.contact.create({
            data: { name, email, message },
        });
        return NextResponse.json(
            { message: "お問い合わせが正常に送信されました。", data: newContact },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing contact request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}