// app/components/auth/LoginDialog.tsx
'use client';

import { signIn } from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

type LoginDialogProps = {
    open: boolean;
    onClose: () => void;
};

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
    return (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="login-dialog-title"
        aria-describedby="login-dialog-description"
    >
        <DialogTitle id="login-dialog-title" sx={{ textAlign: 'center' }}>
            ログイン
        </DialogTitle>

        <DialogContent>
            <DialogContentText
            id="login-dialog-description"
            sx={{ mb: 3, textAlign: 'center' }}
            >
            Googleアカウントでログインしてください
        </DialogContentText>

        <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={() => signIn('google')}
            sx={{
                backgroundColor: '#4285F4',
                color: '#fff',
                py: 1.5,
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#357ae8' },
            }}
            >
                Googleでログイン
        </Button>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={onClose} sx={{ textTransform: 'none' }}>
            キャンセル
            </Button>
        </DialogActions>
        </Dialog>
    );
}
