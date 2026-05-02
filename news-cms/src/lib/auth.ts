import { cookies } from 'next/headers';

const AUTH_COOKIE = 'auth-token';

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();
    const isSecure = process.env.AUTH_COOKIE_SECURE === 'true';

    cookieStore.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        path: '/',
        // Set expiry to matches JWT expiry (e.g., 7 days) or session
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function removeAuthToken() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
}
