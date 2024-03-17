import NextAuth from "next-auth"

import authConfig from "@/auth.config"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    console.log('[INFO] middleware - auth - nextUrl', nextUrl);
    console.log('[INFO] middleware - auth - isLoggedIn', isLoggedIn);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    console.log('[INFO] middleware - auth - isApiAuthRoute', isApiAuthRoute);
    console.log('[INFO] middleware - auth - isPublicRoute', isPublicRoute);
    console.log('[INFO] middleware - auth - isAuthRoute', isAuthRoute);

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        console.log('[INFO] middleware - auth - isAuthRoute if', isAuthRoute);

        if (isLoggedIn) {
            console.log('[INFO] middleware - auth - isLoggedIn if', isLoggedIn);

            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        console.log('[INFO] middleware - auth - !isLoggedIn && !isPublicRoute', !isLoggedIn && !isPublicRoute);

        return Response.redirect(new URL('/auth/login', nextUrl));
    }
    console.log('[INFO] middleware - auth - last return');

    return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}