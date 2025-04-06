import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, context: { params: { id: string } }) {
    
    const params = await Promise.resolve(context.params);
    const postId = params.id;
    const body = await request.json();
    const { title, content } = body;

    try {
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { title, content },
            include: { author: true },
        });
        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post'}, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    const params = await Promise.resolve(context.params);
    const postId = params.id;

    try {
        await prisma.comment.deleteMany({
            where: { postId },
        });

        const deletedPost = await prisma.post.delete({
            where: { id: postId },
        });
        
        return NextResponse.json(deletedPost);
    } catch (error) {
        console.error('DELETE /api/posts/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}