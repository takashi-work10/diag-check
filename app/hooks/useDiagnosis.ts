"use client";
import { useRef, useState } from "react";

/**
 * @param initialQuestionCount 質問数（例: 16）
 * @returns { answers, questionRefs, handleChange, pattern }
 */
export function useDiagnosis(initialQuestionCount: number) {
const [answers, setAnswers] = useState<(number | null)[]>(Array(initialQuestionCount).fill(null));
const questionRefs = useRef<(HTMLLIElement | null)[]>([]);

const updateAnswer = (index: number, value: number): void => {
    setAnswers((prev) => {
    const newAnswers = [...prev];
    newAnswers[index] = value;
    return newAnswers;
    });
};

const scrollToNextQuestion = (currentIndex: number): void => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < answers.length && questionRefs.current[nextIndex]) {
    const topPosition =
        questionRefs.current[nextIndex]!.getBoundingClientRect().top +
        window.scrollY -
        60;
    window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
};

const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedValue = Number(e.target.value);
    updateAnswer(index, selectedValue);
    scrollToNextQuestion(index);
};

  // 診断計算ロジック
const groups = Array.from({ length: 4 }, (_, i) =>
    answers.slice(i * 4, i * 4 + 4).reduce<number>((sum, value) => sum + (value ?? 0), 0)
);
const highestScore = Math.max(...groups);
const highestGroup = groups.indexOf(highestScore);
const pattern = ["A", "B", "C", "D"][highestGroup];

return { answers, questionRefs, handleChange, pattern };
}
