'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Comments from '../components/Comments';
import CommentCount from '../components/CommentCount';

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export default function PostPage() {
  const { data: session } = useSession();
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

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>投稿作成</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>タイトル: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>内容: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: '300px' }}
          ></textarea>
        </div>
        <button type="submit">投稿する</button>
      </form>

      {/* 編集フォーム：編集対象の投稿がある場合に表示 */}
      {editingPostId && (
        <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h2>投稿編集</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1rem' }}>
              <label>タイトル: </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>内容: </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                style={{ width: '300px' }}
              ></textarea>
            </div>
            <button type="submit">更新する</button>
            <button type="button" onClick={() => setEditingPostId(null)}>
              キャンセル
            </button>
          </form>
        </div>
      )}

      <h2>投稿一覧</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts &&
          posts.map((post) => (
            <li
              key={post.id}
              style={{
                marginBottom: '1rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '0.5rem',
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>
                By: {post.author.name} ({post.author.email}) -{' '}
                {new Date(post.createdAt).toLocaleString()}
              </small>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setEditTitle(post.title);
                    setEditContent(post.content);
                  }}
                >
                  編集
                </button>
                <button onClick={() => deletePostMutation.mutate(post.id)}>
                  削除
                </button>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                {expandedReplies.includes(post.id) ? (
                  <>
                    <button
                      onClick={() =>
                        setExpandedReplies(expandedReplies.filter((pid) => pid !== post.id))
                      }
                    >
                      返信を隠す
                    </button>
                    {/* コメント（返信）一覧を表示 */}
                    <Comments postId={post.id} />
                  </>
                ) : (
                  <button
                    onClick={() => setExpandedReplies([...expandedReplies, post.id])}
                  >
                    <CommentCount postId={post.id} /> 件の返信
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
