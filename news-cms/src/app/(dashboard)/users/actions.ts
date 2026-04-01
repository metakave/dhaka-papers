'use server';

import { api } from '@/lib/api';
import { User } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth';

export async function getUsers(): Promise<User[]> {
    try {
        const token = await getAuthToken();
        const response = await api.get('/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data || [];
    } catch (error: any) {
        console.error('Failed to fetch users:', error.message);
        return [];
    }
}

export async function createUser(formData: any) {
    try {
        const token = await getAuthToken();
        await api.post('/users', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath('/users');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.response?.data || error.message };
    }
}

export async function changePassword(oldPassword: string, newPassword: string) {
    try {
        const token = await getAuthToken();
        await api.post('/users/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.response?.data || error.message };
    }
}
export async function updateUser(id: string, formData: FormData) {
    try {
        const token = await getAuthToken();
        await api.put(`/users/${id}`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        revalidatePath('/users');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.response?.data || error.message };
    }
}
