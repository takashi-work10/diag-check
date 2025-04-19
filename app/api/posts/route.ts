// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
    const posts = await prisma.post.findMany({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    const user = await prisma.user.upsert({
        where: { email: session.user.email },
        update: {
            name: session.user.name ?? undefined,
            image: session.user.image ?? null,
        },
        create: {
            name: session.user.name     || 'No Name',
            email: session.user.email,
            image: session.user.image || null,
        },
    });

    const post = await prisma.post.create({
        data: {
            title,
            content,
            author: { connect: { id: user.id }},
        },
        include: { author: true},
    });

    return NextResponse.json(post);
}