"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { patternDetails } from "../constants/pattern-details";

type DiagnosisResult = {
    pattern: string;
    answers: number[];
}

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
                結果を読み込み中
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
}