// app/api/update-profile/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
try {
const body = await request.json();
// リクエストボディがどのようなデータか確認
console.log("Received update-profile request:", body);

const { userId, email, name } = body;
if (!userId || !email || typeof name !== "string") {
    console.error("Missing or invalid parameters:", body);
    return NextResponse.json(
    { error: "Missing or invalid parameters" },
    { status: 400 }
    );
}

// ユーザーが存在するか確認
const user = await prisma.user.findUnique({ where: { id: userId } });
if (!user) {
    console.error("User not found:", userId);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
}

// メール一致の確認
if (user.email !== email) {
    console.error("Email mismatch. DB:", user.email, "Provided:", email);
    return NextResponse.json({ error: "Email does not match" }, { status: 403 });
}

// プロフィールの更新
const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name },
});

console.log("Profile updated successfully:", updatedUser);
return NextResponse.json(updatedUser);
} catch (error) {
console.error("Error updating profile:", error);
return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}
