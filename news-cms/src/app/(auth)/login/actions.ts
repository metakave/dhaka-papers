'use server';

import { api } from '@/lib/api';
import { setAuthToken, removeAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const response = await api.post('/auth/login', { email, password });
        const token = response.data.token;

        // Store token in HTTP-only cookie
        await setAuthToken(token);
    } catch (err: any) {
        return {
            error: err.response?.data?.message || err.response?.data || 'Invalid credentials'
        };
    }

    // Redirect on success (outside try/catch to avoid nextjs redirect error catching)
    redirect('/');
}

export async function logoutAction() {
    await removeAuthToken();
    redirect('/login');
}
