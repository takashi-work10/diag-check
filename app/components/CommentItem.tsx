'use client';

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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
    <div style={{ paddingLeft: comment.parentCommentId ? '2rem' : '0', marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src={comment.author.image || '/default-avatar.png'}
          alt="avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px' }}
        />
        <div>
          <strong>{comment.author.name}</strong>
          <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#555' }}>
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p style={{ marginTop: '0.5rem' }}>{comment.content}</p>
      <div>
        <button onClick={() => setReplying(!replying)}>
          {replying ? '返信フォームを隠す' : '返信'}
        </button>
        <button>いいね</button>
      </div>
      {replying && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: '0.5rem' }}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            style={{ width: '100%', maxWidth: '600px' }}
            placeholder="返信を入力..."
          />
          <br />
          <button type="submit">返信する</button>
          <button type="button" onClick={() => setReplying(false)}>
            キャンセル
          </button>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? '返信を隠す' : `V ${comment.replies.length} 件の返信`}
          </button>
          {showReplies && (
            <div>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
