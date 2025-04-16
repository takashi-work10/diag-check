// app/profile/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { Avatar, Box, Container, Typography, Paper } from '@mui/material';
import Image from 'next/image';

export default async function ProfilePage() {
const session = await getServerSession(authOptions);

if (!session?.user) {
    redirect('/');
}

const { name, email, image } = session.user;

return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
        My Profile
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
        {image ? (
            <Box
            sx={{
                position: 'relative',
                width: 80,
                height: 80,
            }}
            >
            <Image
                src={image}
                alt={name || 'User Avatar'}
                fill
                style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            </Box>
        ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
            {name?.charAt(0).toUpperCase() || '?'}
            </Avatar>
        )}

        <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
            {email}
            </Typography>
        </Box>
        </Box>
    </Paper>
    </Container>
);
}
