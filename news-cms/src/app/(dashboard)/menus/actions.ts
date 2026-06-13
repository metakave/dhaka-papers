'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { MenuItem } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getMenusAction(all: boolean = true): Promise<MenuItem[] | { error: string }> {
    try {
        const token = await getAuthToken();
        const response = await api.get(`/menus?all=${all}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch menus:', error.message);
        return { error: 'Failed to fetch menus' };
    }
}

export async function createMenuAction(prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();
        const parentIdValue = formData.get('parent_id');
        const categoryIdValue = formData.get('category_id');
        const urlValue = formData.get('url');

        const data = {
            title: formData.get('title'),
            title_bn: formData.get('title_bn') || '',
            url: urlValue && urlValue !== "" ? urlValue : null,
            category_id: categoryIdValue && categoryIdValue !== "" && categoryIdValue !== "none" ? categoryIdValue : null,
            parent_id: parentIdValue && parentIdValue !== "" && parentIdValue !== "none" ? parentIdValue : null,
            priority: parseInt(formData.get('priority') as string) || 0,
            is_published: formData.get('is_published') === 'true',
        };

        await api.post('/menus', data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/menus');
    } catch (error: any) {
        return { 
            error: error.response?.data?.message 
                ? error.response.data.message 
                : (typeof error.response?.data === 'string' ? error.response.data : 'Failed to create menu') 
        };
    }
    redirect('/menus');
}

export async function updateMenuAction(id: string, prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();
        const parentIdValue = formData.get('parent_id');
        const categoryIdValue = formData.get('category_id');
        const urlValue = formData.get('url');

        const data = {
            title: formData.get('title'),
            title_bn: formData.get('title_bn') || '',
            url: urlValue && urlValue !== "" ? urlValue : null,
            category_id: categoryIdValue && categoryIdValue !== "" && categoryIdValue !== "none" ? categoryIdValue : null,
            parent_id: parentIdValue && parentIdValue !== "" && parentIdValue !== "none" ? parentIdValue : null,
            priority: parseInt(formData.get('priority') as string) || 0,
            is_published: formData.get('is_published') === 'true',
        };

        await api.put(`/menus/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        revalidatePath('/menus');
    } catch (error: any) {
        return { 
            error: error.response?.data?.message 
                ? error.response.data.message 
                : (typeof error.response?.data === 'string' ? error.response.data : 'Failed to update menu') 
        };
    }
    redirect('/menus');
}

export async function deleteMenuAction(id: string) {
    try {
        const token = await getAuthToken();
        await api.delete(`/menus/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath('/menus');
        return { success: true };
    } catch (error: any) {
        return { 
            error: error.response?.data?.message 
                ? error.response.data.message 
                : (typeof error.response?.data === 'string' ? error.response.data : 'Failed to delete menu') 
        };
    }
}

export async function reorderMenusAction(items: { id: string; priority: number; parent_id: string | null }[]) {
    try {
        const token = await getAuthToken();
        await api.put('/menus/reorder', items, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath('/menus');
        return { success: true };
    } catch (error: any) {
        return { 
            error: error.response?.data?.message 
                ? error.response.data.message 
                : (typeof error.response?.data === 'string' ? error.response.data : 'Failed to reorder menus') 
        };
    }
}
