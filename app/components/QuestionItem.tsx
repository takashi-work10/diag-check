// app/components/QuestionItem.tsx

"use client";

import React from "react";
import { Box, FormControl, FormLabel, Typography } from "@mui/material";
import RadioRating from "./RadioRating";

// 各質問のレイアウトを作るコンポーネント
type QuestionItemProps = {
    question: string;
    index: number;
    answer: number | null;
    onAnswerChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    forwardRef: (element: HTMLLIElement | null) => void;
    style?: React.CSSProperties;
  }
  
  const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    index,
    answer,
    onAnswerChange,
    forwardRef,
    style,
  }) => {
    return (
      <Box
        component="li"
        ref={forwardRef}
        sx={{
          borderBottom: "1px solid #ccc",
          my: { xs: 3, sm: 4 },
          margin: "40px 0",
          opacity: answer !== null ? 0.4 : 1,
          color: answer !== null ? "gray" : "inherit",
          transition: "all 0.3s ease",
          padding: "10px",
          p: { xs: 2, sm: 3 },
          borderRadius: "4px",
          ...style,
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontWeight: "bold", fontSize: { xs: "18px", sm: "21px" } }}>
            {question}
          </FormLabel>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",flexWrap: "nowrap", mt: 1,}}>
            <Box>
              <Typography variant="body2" sx={{ mr: "8px", color: "#a0ff8d", fontWeight: "bold" }}>
                賛成する
              </Typography>
            </Box>
            <Box>
              <RadioRating
                name={`q${index + 1}`}
                value={answer !== null ? answer.toString() : ""}
                onChange={(e) => onAnswerChange(index, e)}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ ml: "8px", color: "#d18dff", fontWeight: "bold" }}>
                反対する
              </Typography>
            </Box>
          </Box>
        </FormControl>
      </Box>
    );
  };

export default QuestionItem;