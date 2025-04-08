import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function extractIdFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  // URL の末尾が空文字の場合など、厳密にチェックしてください。
  const id = segments[segments.length - 1] || segments[segments.length - 2];
  return id || null;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const id = extractIdFromPathname(request.nextUrl.pathname);
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const body = await request.json();
  const { title, content } = body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content },
      include: { author: true },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PATCH /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const id = extractIdFromPathname(request.nextUrl.pathname);
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    await prisma.comment.deleteMany({
      where: { postId: id },
    });
    const deletedPost = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json(deletedPost);
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
