// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const posts = await prisma.post.findMany({
        include: { author: true },
    });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    let user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: session.user.name || 'No Name',
                email: session.user.email,
                image: session.user.image || null,
            },
        });
    }

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