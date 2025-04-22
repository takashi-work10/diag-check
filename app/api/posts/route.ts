// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: { author: true },
            orderBy: { createdAt: 'desc' },
        });
    return NextResponse.json(posts);
    } catch (err: unknown) {
    console.error('[GET /api/posts] error:', err);
    const message = err instanceof Error
        ? err.message
        : 'Failed to fetch posts';
    return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.email) {
    return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
    );
}

    const { title, content } = await request.json();

  // 必須チェック（任意）
    if (!title.trim() || !content.trim()) {
        return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
    );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });
    
        if (!user) {
        return NextResponse.json({ error: 'ユーザーが存在しません' }, { status: 404 });
    }

    const post = await prisma.post.create({
        data: {
        title,
        content,
        author: { connect: { id: user.id } },
    },
    include: { author: true },
    });

    return NextResponse.json(post);
}
