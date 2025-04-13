// app/result/detailed/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { patternDetails } from "../../constants/pattern-details";
import axios from "axios";

type DiagnosisResult = {
    pattern: string;
    answers: number[];
};

export default async function DetailedResultPage() {
  // サーバー側で認証チェック
    const session = await getServerSession(authOptions);
    if (!session) {
    redirect("/auth/signin");
    }

  // NEXTAUTH_URL 環境変数が本番環境で設定されている前提です
    const baseUrl = process.env.NEXTAUTH_URL!;
    
    let diagnosisResult: DiagnosisResult | null = null;
    try {
    const res = await axios.get(`${baseUrl}/api/save-diagnosis`, {
        timeout: 5000,
    });
    diagnosisResult = res.data;
    } catch (error) {
    console.error("診断結果の取得に失敗しました:", error);
    }

    if (!diagnosisResult) {
    return (
        <Box sx={{ textAlign: "center", p: 2 }}>
        診断結果を読み込み中…
        </Box>
    );
    }

    const currentPattern = patternDetails[diagnosisResult.pattern] || {
    intro: "診断結果が見つかりません",
    title: "診断結果エラー",
    description: [],
    strengths: [],
    weaknesses: [],
    recommended: [],
    nextSteps: [],
    };

    return (
    <Box
        sx={{
        p: 2,
        backgroundColor: "#F9F9F9",
        minHeight: "100vh",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
    >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        {currentPattern.title}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 3 }}>
        {currentPattern.intro}
        </Typography>
        
        <Box sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}>
        {/* 説明 */}
        {currentPattern.description.length > 0 && (
            <Box sx={{ mb: 2 }}>
            <Typography variant="h6">説明</Typography>
            {currentPattern.description.map((desc, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {desc}
                </Typography>
            ))}
            </Box>
        )}
        
        {/* 強み */}
        {currentPattern.strengths.length > 0 && (
            <Box sx={{ mb: 2 }}>
            <Typography variant="h6">強み</Typography>
            {currentPattern.strengths.map((strength, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {strength}
                </Typography>
            ))}
            </Box>
        )}
        
        {/* 弱み */}
        {currentPattern.weaknesses.length > 0 && (
            <Box sx={{ mb: 2 }}>
            <Typography variant="h6">弱み</Typography>
            {currentPattern.weaknesses.map((weakness, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {weakness}
                </Typography>
            ))}
            </Box>
        )}
        
        {/* おすすめ */}
        {currentPattern.recommended.length > 0 && (
            <Box sx={{ mb: 2 }}>
            <Typography variant="h6">おすすめ</Typography>
            {currentPattern.recommended.map((rec, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {rec}
                </Typography>
            ))}
            </Box>
        )}
        
        {/* 次のステップ */}
        {currentPattern.nextSteps.length > 0 && (
            <Box sx={{ mb: 2 }}>
            <Typography variant="h6">次のステップ</Typography>
            {currentPattern.nextSteps.map((step, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {step}
                </Typography>
            ))}
            </Box>
        )}
        </Box>
    </Box>
    );
}
