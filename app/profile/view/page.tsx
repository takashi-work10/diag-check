"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UserProfile = {
    id: string;
    name: string;
    email: string;
    image?: string;
};

export default function ProfileViewPage() {
    const { data: session } = useSession();
    const {
        data: fetchedProfile,
        isLoading,
        isError,
    }  = useQuery<UserProfile>({
        queryKey: ["profile", session?.user?.id],
        queryFn: async () => {
        const response = await axios.get(
            `/api/get-profile?userId=${session!.user.id}`
        );
        return response.data;
    },
    enabled: !!session?.user?.id,
    });

    if (isLoading) return <div>プロフィール読み込み中…</div>;
    if (isError) return <div>プロフィールの読み込みに失敗しました。</div>;

    return (
    <div>
        <h1>プロフィール表示</h1>
        <p>名前: {fetchedProfile?.name}</p>
        <p>メールアドレス: {fetchedProfile?.email}</p>
        {fetchedProfile?.image && (
        <div>
            <img src={fetchedProfile.image} alt="プロフィール画像" />
        </div>
        )}
    </div>
    );
}
