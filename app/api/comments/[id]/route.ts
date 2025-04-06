// app/comments/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { content } = body;
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  // オーナーチェック：コメントの作者がセッションのユーザーと一致するか
  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
  });
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }
  // ここでは、メールでチェック（必要ならIDでチェック）
  if (comment.authorId !== (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: params.id },
    data: { content },
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // オーナーチェック
  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
  });
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }
  if (comment.authorId !== (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: params.id },
  });

  return NextResponse.json(deletedComment);
}
