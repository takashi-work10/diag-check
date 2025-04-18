// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import Image from "next/image";

export default async function ProfilePage() {
const session = await getServerSession(authOptions);
if (!session?.user) {
    redirect("/");
}
const { name, email, image } = session.user;

return (
    <Box
    sx={{
        minHeight: "100vh",
        p: 2,
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
    }}
    >
    <Paper
        elevation={8}
        sx={{
        p: 4,
        borderRadius: "20px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "600px",
        textAlign: "center",
        backgroundColor: "#fff",
        }}
    >
        <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: "36px", color: "#FF6F91" }}
        >
        My Profile
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {image ? (
            <Box
            sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
            }}
            >
            <Image
                src={image}
                alt={name || "User Avatar"}
                fill
                style={{ objectFit: "cover" }}
            />
            </Box>
        ) : (
            <Avatar sx={{ width: 100, height: 100, bgcolor: "#CF9FFF" }}>
            {name?.charAt(0).toUpperCase() || "?"}
            </Avatar>
        )}

        <Typography variant="h6" sx={{ fontSize: "24px", fontWeight: 500 }}>
            {name}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "16px", color: "#555" }}>
            {email}
        </Typography>
        </Box>
    </Paper>
    </Box>
);
}
