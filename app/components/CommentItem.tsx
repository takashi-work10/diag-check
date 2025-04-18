'use client';

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Box, Avatar, Typography, TextField, Button } from '@mui/material';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  replies?: Comment[];
  parentCommentId?: string | null;
};

type CommentItemProps = {
  comment: Comment;
  postId: string;
};

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const replyMutation = useMutation({
    mutationFn: async (data: { postId: string; content: string; parentCommentId: string }) => {
      const res = await axios.post('/api/comments', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReplyText('');
      setReplying(false);
    },
  });

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('ログインしてください。');
      return;
    }
    replyMutation.mutate({ postId, content: replyText, parentCommentId: comment.id });
  };

  return (
    <Box sx={{ pl: comment.parentCommentId ? 4 : 0, mb: 3 }}>
      {/* ヘッダー：アバター＋名前＋日時 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 40, height: 40 }} src={comment.author.image}>
          {!comment.author.image && comment.author.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{comment.author.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* 本文 */}
      <Typography variant="body1" sx={{ mt: 1 }}>
        {comment.content}
      </Typography>

      {/* 操作ボタン */}
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button
          size="small"
          onClick={() => setReplying((f) => !f)}
          sx={{ textTransform: 'none' }}
        >
          {replying ? '返信フォームを隠す' : '返信'}
        </Button>
        <Button size="small" sx={{ textTransform: 'none' }}>
          いいね
        </Button>
      </Box>

      {/* 返信フォーム */}
      {replying && (
        <Box
          component="form"
          onSubmit={handleReplySubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            multiline
            rows={2}
            placeholder="返信を入力…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            fullWidth
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#CF9FFF',
                color: '#fff',
                textTransform: 'none',
              }}
            >
              返信する
            </Button>
            <Button
              variant="outlined"
              onClick={() => setReplying(false)}
              sx={{ textTransform: 'none' }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      )}

      {/* 子返信のトグル */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            size="small"
            onClick={() => setShowReplies((f) => !f)}
            sx={{ textTransform: 'none' }}
          >
            {showReplies
              ? '返信を隠す'
              : `V ${comment.replies.length} 件の返信`}
          </Button>
          {showReplies &&
            comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}
