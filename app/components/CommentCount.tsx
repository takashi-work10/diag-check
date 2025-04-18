'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Typography } from '@mui/material';

export default function CommentCount({ postId }: { postId: string }) {
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['commentCount', postId],
    queryFn: async () => {
      const res = await axios.get(`/api/comments?postId=${postId}`);
      return res.data;
    },
  });

  if (isLoading) return <Typography component="span">...</Typography>;
  if (isError)   return <Typography component="span">0</Typography>;

  return <Typography component="span">{comments.length}</Typography>;
}
