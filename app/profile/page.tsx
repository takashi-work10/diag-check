"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UserProfile = {
    id: string;
    name: string;
    email: string;
    image?: string;
};

export default function ProfilePage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const {
        data: fetchedProfile,
        isLoading,
        isError,
    } = useQuery<UserProfile>({
        queryKey: ["profile", session?.user?.id],
        queryFn: async () => {
            const response = await axios.get(
                `/api/get-profile?userId=${session!.user.id}`
            );
            return response.data;
        },
        enabled: !!session?.user?.id,
    });

    const [profile, setProfile] = useState({
        name: "",
    });

    useEffect(() => {
        if (fetchedProfile) {
            setProfile({
                name: fetchedProfile.name || "",
            });
        }
    }, [fetchedProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedProfile: { name: string }) => {
            const userId = session?.user?.id;
            const email = session?.user?.email;
            if (!userId || !email) {
                throw new Error("ユーザーIDまたはメールアドレスが取得できませんでした");
            }
            return await axios.post("/api/update-profile", {
                userId,
                email,
                ...updatedProfile,
            });
        },
        onSuccess: () => {
            alert("プロフィールが更新されました");
            queryClient.invalidateQueries({ queryKey: ["profile", session?.user?.id] });
        },
        onError: () => {
            alert("更新に失敗しました");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profile);
    };

    if (isLoading) return <div>プロフィール読み込み中</div>;
    if (isError) return <div>プロフィールの読み込みに失敗しました。</div>;

    return (
        <div>
            <h1>プロフィール編集</h1>
            <Link href="/profile/view">プロフィール表示</Link>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>名前:</label>
                    <input
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    disabled={updateProfileMutation.status === "pending"} 
                >
                    更新
                </button>
            </form>
        </div>
    )
}