import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("APIで受け取ったデータ:", body);
        const { pattern, answers } = body;

        const newResult = await prisma.diagnosisResult.create({
            data: { pattern, answers },
        });
        console.log("DBに保存された結果", newResult);
        return NextResponse.json(newResult, { status: 201 });
    } catch (error) {
        console.log("エラーが発生しました:", error);
        return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const latestResult = await prisma.diagnosisResult.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(latestResult);
    } catch (error) {
        console.error("GETでエラーが発生しました:", error);
        return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
    }
}