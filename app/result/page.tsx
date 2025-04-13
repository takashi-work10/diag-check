"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { patternDetails } from "../constants/pattern-details";

type DiagnosisResult = {
    pattern: string;
    answers: number[];
};

export default function ResultPage() {
    const { data: result, isLoading, error } = useQuery<DiagnosisResult>({
        queryKey: ["diagnosisResult"],
        queryFn: async () => {
            const res = await axios.get("/api/save-diagnosis");
            return res.data;
    },
});

    if (isLoading) {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
        結果を読み込み中…
        </Box>
    );
    }

    if (error || !result) {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
        結果の取得に失敗しました
        </Box>
    );
    }

    const currentPattern = patternDetails[result.pattern];
    if (!currentPattern) {
    return (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
        診断パターンが見つかりませんでした。
        </Box>
    );
    }

    return (
    <Box
        sx={{
        padding: "20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        minHeight: "100vh",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
    >
        <Box
        sx={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            margin: "auto",
            maxWidth: "600px",
            padding: "30px",
            mt: "60px"
        }}
        >
        <Typography variant="h4" sx={{ color: "#FF6F91", mb: 2 }}>
            {currentPattern.intro}
        </Typography>
        <Typography variant="h5" sx={{ color: "#FF9671", mb: 3 }}>
            {currentPattern.title}
        </Typography>

        {/* 他の診断結果の詳細表示 */}
        <Box sx={{ mt: 3 }}>
            <Link href="/result/detailed">
            <Button
                variant="contained"
                sx={{
                fontSize: "20px",
                backgroundColor: "#9CD1FF",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "30px",
                }}
            >
                詳細結果を見る
            </Button>
            </Link>
        </Box>
        </Box>
    </Box>
    );
    }
