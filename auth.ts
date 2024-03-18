import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { getUserById } from "@/data/user"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    pages: {
        signIn: "/authlogin",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            });
        }
    },
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     if (!user.id) return false;

        //     const existingUser = await getUserById(user.id);

        //     if (!existingUser || !existingUser.emailVerified) {
        //         return false;
        //     }

        //     return true
        // },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.role = existingUser.role;

            return token
        },
        async session({ session, user, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})