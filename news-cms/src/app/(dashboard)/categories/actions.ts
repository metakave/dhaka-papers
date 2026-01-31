'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Category } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getCategoriesAction(): Promise<Category[] | { error: string }> {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch categories:', error.message);
        return { error: 'Failed to fetch categories' };
    }
}

export async function createCategoryAction(prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();
        const data = {
            name: formData.get('name'),
            name_bn: formData.get('name_bn'),
            description: formData.get('description'),
        };

        await api.post('/categories', data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/categories');
    } catch (error: any) {
        return { error: error.response?.data?.message || 'Failed to create category' };
    }
    redirect('/categories');
}

export async function updateCategoryAction(id: string, prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();
        const data = {
            name: formData.get('name'),
            name_bn: formData.get('name_bn'),
            description: formData.get('description'),
        };

        await api.put(`/categories/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/categories');
    } catch (error: any) {
        return { error: error.response?.data?.message || 'Failed to update category' };
    }
    redirect('/categories');
}

export async function deleteCategoryAction(id: string) {
    try {
        const token = await getAuthToken();
        await api.delete(`/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath('/categories');
        return { success: true };
    } catch (error: any) {
        return { error: error.response?.data?.message || 'Failed to delete category' };
    }
}
