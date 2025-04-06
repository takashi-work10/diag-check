'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function CommentCount({ postId }: { postId: string }) {
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['commentCount', postId],
    queryFn: async () => {
      const res = await axios.get(`/api/comments?postId=${postId}`);
      return res.data;
    },
  });

  if (isLoading) return <span>...</span>;
  if (isError) return <span>0</span>;

  return <span>{comments?.length || 0}</span>;
}
