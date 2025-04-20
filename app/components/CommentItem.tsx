'use client';

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Box, Typography, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

  // --- 編集機能 ---
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await axios.patch(`/api/comments/${id}`, { content });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setEditing(false);
    },
  });

  // --- 削除機能 ---
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/comments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // --- 返信機能（既存） ---
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
    replyMutation.mutate({
      postId,
      content: replyText,
      parentCommentId: comment.id,
    });
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('ログインしてください。');
      return;
    }
    updateCommentMutation.mutate({ id: comment.id, content: editText });
  };

  return (
    <Box sx={{ pl: comment.parentCommentId ? 4 : 0, mb: 3 }}>
      {/* ヘッダー：アバター＋名前＋日時 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {comment.author.image ? (
          <Box
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <Image
              src={comment.author.image}
              alt={comment.author.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#CF9FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {comment.author.name.charAt(0)}
          </Box>
        )}
        <Box>
          <Typography variant="subtitle2">{comment.author.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* 編集モード */}
      {editing ? (
        <Box
          component="form"
          onSubmit={handleEditSubmit}
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <TextField
            multiline
            rows={2}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            fullWidth
            size="small"
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={updateCommentMutation.status === "pending"}
              sx={{ textTransform: 'none' }}
            >
              更新
            </Button>
            <Button
              size="small"
              onClick={() => setEditing(false)}
              sx={{ textTransform: 'none' }}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      ) : (
        <>
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

            {/* コメント主だけに表示される「編集」「削除」 */}
            {session?.user?.email === comment.author.email && (
              <>
                <Button
                  size="small"
                  startIcon={<EditIcon fontSize="small" />}
                  onClick={() => {
                    setEditing(true);
                    setEditText(comment.content);
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  編集
                </Button>
                <Button
                size="small"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() => deleteCommentMutation.mutate(comment.id)}
                sx={{ textTransform: 'none' }}
              >
                削除
              </Button>
              </>
            )}
          </Box>
        </>
      )}

      {/* 返信フォーム */}
      {replying && (
        <Box
          component="form"
          onSubmit={handleReplySubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
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
              sx={{ backgroundColor: '#CF9FFF', color: '#fff', textTransform: 'none' }}
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
              <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
        </Box>
      )}
    </Box>
  );
}
