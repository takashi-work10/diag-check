// app/components/RadioRating.tsx ratingOptionsでデフォルトのラジオボタンを作ったが、それだと味気ないので、ここでは

"use client";

import React from "react";
import {Radio, RadioGroup, SvgIcon} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { defaultRatingOptions, RatingOption } from "../constants/ratingOptions";

// 各ラジオボタンのオプション

// Radioボタンを作るコンポーネント
type RadioRatingProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  options?: RatingOption[];
}

const RadioRating: React.FC<RadioRatingProps> = ({
  value,
  onChange,
  name,
  options = defaultRatingOptions,
}) => {
  return (
    <RadioGroup row name={name} value={value || ""} onChange={onChange} >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          icon={
            <RadioButtonUncheckedIcon
              sx={{ fontSize: { xs: option.size * 0.4, sm: option.size * 0.7, md: option.size * 1.1 }, color: option.color }}
            />
          }
          checkedIcon={
            <SvgIcon sx={{ fontSize: { xs: option.size * 0.4, sm: option.size * 0.7, md: option.size * 1.1 }, color: option.color, fill: option.color }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 6-6" stroke="white" strokeWidth="2" fill="none" />
            </SvgIcon>
          }
        />
      ))}
    </RadioGroup>
  );
};

export default RadioRating;