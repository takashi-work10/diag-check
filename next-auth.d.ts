import NextAuth, { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // DefaultSession を継承して user.id を追加
    interface Session extends DefaultSession {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    }
}

declare module "next-auth/jwt" {
  // JWT に id を追加
    interface JWT extends DefaultJWT {
    id: string;
    }
}
