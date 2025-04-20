// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(
  request: NextRequest,
  context
): Promise<NextResponse> {
  // context を必要な型にキャストする
  const { params } = context as { params: { id: string } };

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { content } = await request.json();
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { email: true }
      }
    }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.author.email !== session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: params.id },
    data: { content },
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(
  request: NextRequest,
  context
): Promise<NextResponse> {
  // context の中から params を抽出（必要な型にキャスト）
  const { params } = context as { params: { id: string } };

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { email: true }
      }
    }
  });
  
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.author.email !== session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: params.id },
  });

  return NextResponse.json(deletedComment);
}
