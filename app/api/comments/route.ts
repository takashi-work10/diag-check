// app/api/comments/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
            author: { select: { id: true, name: true, email: true, image: true }}
        },
    });

    return NextResponse.json(comments);
}


export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, content } = body;
    if (!postId || !content) {
        return NextResponse.json({ error: 'postId and content are required '}, { status: 400 });
    }

    let user = await prisma.user.findUnique({
        where: { email: session.user.email},
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

    const comment = await prisma.comment.create({
        data: {
            content,
            post: { connect: { id: postId } },
            author: { connect: { id: user.id }}
        },
        include: {
            author: { select: { id: true, name: true, email: true, image: true }}
        },
    });
    return NextResponse.json(comment);
}