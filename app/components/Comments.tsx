'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentItem from './CommentItem';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

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
  parentCommentId?: string | null;
};

export default function Comments({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // コメント一覧取得
  const { data: comments, isLoading, isError } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axios.get<Comment[]>(
        `/api/comments?postId=${postId}`
      );
      return res.data;
    },
  });

  // デバッグログ
  useEffect(() => {
    console.log('Fetched comments:', comments);
  }, [comments]);

  // 新規コメント作成
  const [newCommentText, setNewCommentText] = useState('');
  const createCommentMutation = useMutation({
    mutationFn: async (data: { postId: string; content: string }) => {
      const res = await axios.post('/api/comments', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewCommentText('');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('ログインしてください。');
      return;
    }
    if (!newCommentText.trim()) {
      alert('コメントを入力してください。');
      return;
    }
    createCommentMutation.mutate({ postId, content: newCommentText });
  };

  if (isLoading) return <div>コメント読み込み中...</div>;
  if (isError)   return <div>コメントの取得に失敗しました</div>;

  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h6" gutterBottom>
          コメント
        </Typography>

        {/* 新規コメント入力フォーム */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}
        >
          <TextField
            multiline
            rows={3}
            placeholder="コメントを入力してください…"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            fullWidth
            size="small"
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!newCommentText.trim()}
              sx={{
                backgroundColor: '#CF9FFF',
                color: '#fff',
                textTransform: 'none',
              }}
            >
              コメントする
            </Button>
          </Box>
        </Box>

        {/* コメント一覧（すべて同一階層で表示） */}
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            まだコメントがありません。
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
