"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Drawer,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginDialog from "../app/components/auth/LoginDialog"; 
import CloseIcon from '@mui/icons-material/Close';

export default function Header() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // モバイル用 Drawer の内容
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: {sm: 2} }}>
        <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center", mt: 3}}>
            <Link href="/diagnosis">
                <Button variant="contained" sx={{borderRadius: "30px", fontSize: "18px", backgroundColor: "#CF9FFF", color: "#fff",}} >テストを受ける</Button>
            </Link>
            <CloseIcon />
        </Box>
        <Box sx={{ mt: 3, borderBottom: "1px solid #e6e6e6" }} />
        <Box sx={{ my: 2 }}>
            <Link href="/diagnosis" style={{ textDecoration: "none", color: "#000" }}>
            診断テスト
            </Link>
        </Box>
        <Box sx={{ mb: 2 }}>
            <Link
            href="/posts"
            style={{ textDecoration: "none", color: "#000" }}
            >
            コミュニティ
            </Link>
        </Box>
        <Box sx={{ mb: 2 }}>
            <Link
            href="/blog"
            style={{ textDecoration: "none", color: "#000" }}
            >
            合格の極意
            </Link>
        </Box>
        <Box sx={{ mb: 2 }}>
            <Link
            href="/contact"
            style={{ textDecoration: "none", color: "#000" }}
            >
            お問い合わせ
            </Link>
        </Box>
        <Box sx={{ mb: 2 }}>
            {session ? (
            <Box>
            <Box sx={{mb: 2}}>
                <Link
                href="/profile"
                style={{ textDecoration: "none", color: "#000" }}
                >
                    プロフィール
                </Link>
            </Box>
            <Box
            onClick={() => signOut()}
            >
                ログアウト
            </Box>
            </Box>) : (
            <Box
                onClick={() => setLoginDialogOpen(true)}
            >
                ログイン
            </Box>
            )}
        </Box>
        </Box>
    );

    return (
        <>
        <AppBar
            position="fixed"
            sx={{
            top: 0,
            left: 0,
            width: "100%",
            px: { xs: "0", sm: "20px" },
            background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1100,
            }}
        >
            <Toolbar
            sx={{
                justifyContent: "space-between",
                minHeight: { xs: "50px", sm: "60px" },
            }}
            >
            {/* 左側：ホームリンク（大画面用） */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Link
                href="/"
                style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textDecoration: "none",
                    fontSize: "1.2rem",
                }}
                >
                ホーム
                </Link>
            </Box>

            {/* 右側：リンク（大画面用） */}
            <Box
                sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                }}
            >
                <Link
                href="/posts"
                style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textDecoration: "none",
                    marginRight: "10px",
                    fontSize: "1.1rem",
                }}
                >
                コミュニティ
                </Link>
                <Link
                href="/contact"
                style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textDecoration: "none",
                    marginRight: "10px",
                    fontSize: "1.1rem",
                }}
                >
                お問い合わせ
                </Link>
                {session ? (
                <IconButton onClick={handleProfileMenuOpen} color="inherit">
                    <Avatar
                    alt={session.user?.name || "User"}
                    src={session.user?.image || undefined}
                    />
                </IconButton>
                ) : (
                <Button
                    color="inherit"
                    onClick={() => setLoginDialogOpen(true)}
                    sx={{
                    fontSize: "1.1rem",
                    textTransform: "none",
                    fontWeight: "bold",
                    }}
                >
                    ログイン
                </Button>
                )}
            </Box>

            {/* 小さい画面用：ハンバーガーメニュー */}
            <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "space-between", width: "100%", p: 0 }}>
                <Link href="/" style={{display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src="/favicon.ico" className="App-logo" alt="logo" style={{width: "8%", marginRight: "5px" }} />
                    <Typography sx={{fontSize: "11px", fontWeight: "bold", color: "white" }}>英検学習タイプ診断</Typography>
                </Link>
                <Box>
                    <IconButton color="inherit" onClick={handleDrawerToggle}>
                    <MenuIcon />
                    </IconButton>
                </Box>
            </Box>
            </Toolbar>
        </AppBar>

        {/* モバイル用 Drawer */}
        <Drawer
            anchor="right"
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
            }}
        >
            {drawer}
        </Drawer>

        {/* プロフィール用メニュー（大画面の場合） */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <MenuItem onClick={handleMenuClose} component={Link} href="/profile">
            プロフィール
            </MenuItem>
            <MenuItem
            onClick={() => {
                signOut();
                handleMenuClose();
            }}
            >
            サインアウト
            </MenuItem>
        </Menu>

        {/* ログインモーダル */}
        <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
        </>
    );
    }
