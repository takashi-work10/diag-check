import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions = {
providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
],
secret: process.env.NEXTAUTH_SECRET,
callbacks: {
    // 1) JWT を生成・更新するたびに呼ばれる
    async jwt({ token }: { token: JWT }) {
    if (token.sub) {
        token.id = token.sub;
    }
    return token;
    },

    // 2) クライアントへ渡す session オブジェクトを加工
    async session({
    session,
    token,
    }: {
    session: Session;
    token: JWT;
    }) {
    if (session.user && token.id) {
        session.user.id = token.id as string;
    }
    return session;
    },
},
};

export default authOptions;
