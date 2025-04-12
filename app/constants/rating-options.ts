// app/constants/ratingOptions.ts ラジオボタンがまとめられている

export type RatingOption = {
    value: string;
    size: number;
    color: string;
}

export const defaultRatingOptions: RatingOption[] = [
    { value: "1", size: 70, color: "#a0ff8d" },
    { value: "2", size: 60, color: "#a0ff8d" },
    { value: "3", size: 50, color: "#a0ff8d" },
    { value: "4", size: 40, color: "#D3D3D3" },
    { value: "5", size: 50, color: "#d18dff" },
    { value: "6", size: 60, color: "#d18dff" },
    { value: "7", size: 70, color: "#d18dff" },
];