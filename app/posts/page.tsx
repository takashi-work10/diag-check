'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Comments from '../components/Comments';
import CommentCount from '../components/CommentCount';
import { Box, Paper, Typography, TextField, Button, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export default function PostPage() {
  const { data: session } = useSession();
  console.log('session data:', session);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 各投稿の返信表示状態（post.id の配列）
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: posts, isLoading, isError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axios.get('/api/posts');
      return res.data;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPost: { title: string; content: string }) => {
      const res = await axios.post('/api/posts', newPost);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setContent('');
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const res = await axios.patch(`/api/posts/${id}`, { title, content });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPostId(null);
      setEditTitle('');
      setEditContent('');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/posts/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setExpandedReplies(expandedReplies.filter((pid) => pid !== id));
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('ログインしてください。');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を両方入力してください。');
      return;
    }
    createPostMutation.mutate({ title, content });
    setTitle('');
    setContent('');
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('ログインしてください。');
      return;
    }
    if (editingPostId) {
      updatePostMutation.mutate({ id: editingPostId, title: editTitle, content: editContent });
    }
  };

  if (!session) return <div>ログインしてください。</div>;
  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 2,
        py: 4,
        background: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 投稿作成フォーム */}
      <Typography variant="h3" sx={{ fontSize: 36, color: '#FF6F91', mb: 4, mt: 5 }}>
        投稿作成
      </Typography>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          mb: 6,
          width: '100%',
          maxWidth: 600,
          borderRadius: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!title.trim() || !content.trim()}
            sx={{
              mt: 2,
              backgroundColor: '#CF9FFF',
              color: '#fff',
              borderRadius: '30px',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            投稿する
          </Button>
        </Box>
      </Paper>

      {/* 編集フォーム */}
      {editingPostId && (
        <Paper
          component="form"
          onSubmit={handleUpdate}
          sx={{
            p: 4,
            mb: 6,
            width: '100%',
            maxWidth: 600,
            borderRadius: '20px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            投稿編集
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="タイトル"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="内容"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#CF9FFF', color: '#fff', textTransform: 'none' }}
              >
                更新する
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditingPostId(null)}
                sx={{ textTransform: 'none' }}
              >
                キャンセル
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 投稿一覧 */}
      <Typography variant="h3" sx={{ fontSize: 36, color: '#FF6F91', mb: 4 }}>
        投稿一覧
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {(posts ?? []).map((post) => (
          <Paper
            key={post.id}
            sx={{
              p: 4,
              borderRadius: '20px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
            {/* 投稿タイトル */}
            <Typography variant="h5" sx={{ mb: 2 }}>
              {post.title}
            </Typography>
            {/* 投稿本文 */}
            <Typography variant="body1" sx={{ color: '#555', mb: 3 }}>
              {post.content}
            </Typography>

            {/* 著者情報 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {post.author.image ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              ) : (
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#CF9FFF' }}>
                {post.author.name.charAt(0)}
              </Avatar>
              )}
              <Typography variant="body2" color="textSecondary">
                By: {post.author.name} ({post.author.email}) –{' '}
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Box>

            {/* 編集・削除ボタン */}
            {session?.user?.email === post.author.email && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                size="small"
                startIcon={<EditIcon fontSize="small" />}
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  setEditingPostId(post.id);
                  setEditTitle(post.title);
                  setEditContent(post.content);
                }}
              >
                編集
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() => deletePostMutation.mutate(post.id)}
                sx={{ textTransform: 'none' }}
              >
                削除
              </Button>
            </Box>
            )}

            {/* コメント表示切替 */}
            <Box sx={{ mb: 2 }}>
              {expandedReplies.includes(post.id) ? (
                <Button
                  size="small"
                  onClick={() =>
                    setExpandedReplies((prev) => prev.filter((pid) => pid !== post.id))
                  }
                  sx={{ textTransform: 'none' }}
                >
                  コメントを隠す
                </Button>
              ) : (
                <Button
                  size="small"
                  onClick={() => setExpandedReplies((prev) => [...prev, post.id])}
                  sx={{ textTransform: 'none' }}
                >
                  <CommentCount postId={post.id} /> 件のコメント
                </Button>
              )}
            </Box>

            {/* コメント機能 */}
            {expandedReplies.includes(post.id) && <Comments postId={post.id} />}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}





