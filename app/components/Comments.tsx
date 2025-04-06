'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import CommentItem from './CommentItem';

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

export default function Comments({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // APIからコメント一覧を取得
  const { data: comments, isLoading, isError } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axios.get(`/api/comments?postId=${postId}`);
      return res.data;
    },
  });

  // デバッグ用：取得したコメントデータをログ出力
  useEffect(() => {
    console.log('Fetched comments:', comments);
  }, [comments]);

  // 新規コメント作成用
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
    createCommentMutation.mutate({ postId, content: newCommentText });
  };

  // トップレベルのコメント（parentCommentId がないもの）を抽出
  const topLevelComments = (comments ?? []).filter((c) => !c.parentCommentId);

  if (isLoading) return <div>コメント読み込み中...</div>;
  if (isError) return <div>コメントの取得に失敗しました</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>コメント</h3>
      {/* 新規コメント入力フォーム */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          rows={3}
          style={{ width: '100%', maxWidth: '600px' }}
          placeholder="コメントを入力してください..."
        ></textarea>
        <br />
        <button type="submit">コメントする</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: '1rem' }}>
              <CommentItem comment={comment} postId={postId} />
            </li>
          ))
        ) : (
          <li>コメントはまだありません。</li>
        )}
      </ul>
    </div>
  );
}
