'use server';
// v1.0.1 - Brief actions fix


import { api, API_URL } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { News } from '@/types';

export interface BriefItem {
    title: string;
    description: string;
}

// Fetch all published/draft briefs for the admin list
export async function getBriefsAction(): Promise<{ briefs: News[]; error?: string }> {
    try {
        const session = await getAuthToken();
        if (!session) return { briefs: [] };

        const res = await api.get('/news/admin?is_brief=true&sort=latest&limit=20', {
            headers: { Authorization: `Bearer ${session}` },
        });

        return { briefs: res.data?.newsList ?? [] };
    } catch (error) {
        console.error('Error fetching briefs:', error);
        return { briefs: [], error: 'Failed to load briefs' };
    }
}

// Fetch a single brief's items by slug
export async function getBriefBySlug(slug: string): Promise<{ brief: News | null; items: BriefItem[] }> {
    try {
        const res = await api.get(`/news/${slug}`);
        const brief: News = res.data;
        let items: BriefItem[] = [];
        try {
            if (brief.content && brief.content.trimStart().startsWith('[')) {
                items = JSON.parse(brief.content);
            }
        } catch {
            items = [];
        }
        return { brief, items };
    } catch {
        return { brief: null, items: [] };
    }
}

// Create a new brief
export async function createBriefAction(
    titleBn: string,
    items: BriefItem[],
    status: string,
    lang: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getAuthToken();
        if (!session) throw new Error('Unauthorized');

        // Fetch category ID for 'news-briefs'
        const catRes = await api.get('/categories');
        const briefsCat = catRes.data.find((c: any) => c.slug === 'news-briefs');
        if (!briefsCat) throw new Error('News Briefs category not found');

        const formData = new FormData();
        formData.append('title', titleBn);
        formData.append('title_en', titleBn); // slug generation source
        formData.append('content', JSON.stringify(items));
        formData.append('excerpt', items[0]?.title ?? titleBn);
        formData.append('is_brief', 'true');
        formData.append('is_featured', 'false');
        formData.append('status', status);
        formData.append('category_id', briefsCat.id);
        formData.append('lang', lang);
        formData.append('thumbnail', ''); // DB requires not null
        formData.append('thumbnail_caption', '');

        const response = await fetch(`${API_URL}/news`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session}`,
                // DO NOT set Content-Type, let the browser/node-fetch handle the boundary
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from backend:', errorText);
            return { success: false, error: errorText || 'Failed to create brief' };
        }

        revalidatePath('/briefs');
        return { success: true };
    } catch (error: any) {
        console.error('Error creating brief:', error);
        return { success: false, error: error.message || 'Failed to create brief' };
    }
}

// Update an existing brief
export async function updateBriefAction(
    id: string,
    titleBn: string,
    items: BriefItem[],
    status: string,
    lang: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getAuthToken();
        if (!session) throw new Error('Unauthorized');

        // Fetch category ID for 'news-briefs'
        const catRes = await api.get('/categories');
        const briefsCat = catRes.data.find((c: any) => c.slug === 'news-briefs');
        if (!briefsCat) throw new Error('News Briefs category not found');

        const formData = new FormData();
        formData.append('title', titleBn);
        formData.append('title_en', titleBn);
        formData.append('content', JSON.stringify(items));
        formData.append('excerpt', items[0]?.title ?? titleBn);
        formData.append('is_brief', 'true');
        formData.append('is_featured', 'false');
        formData.append('status', status);
        formData.append('category_id', briefsCat.id);
        formData.append('lang', lang);
        formData.append('thumbnail', ''); // DB requires not null
        formData.append('thumbnail_caption', '');

        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session}`,
                // DO NOT set Content-Type
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from backend:', errorText);
            return { success: false, error: errorText || 'Failed to update brief' };
        }

        revalidatePath('/briefs');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating brief:', error);
        return { success: false, error: error.message || 'Failed to update brief' };
    }
}

// Delete a brief
export async function deleteBriefAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getAuthToken();
        if (!session) throw new Error('Unauthorized');

        await api.delete(`/news/${id}`, {
            headers: { Authorization: `Bearer ${session}` },
        });

        revalidatePath('/briefs');
        return { success: true };
    } catch (error) {
        console.error('Error deleting brief:', error);
        return { success: false, error: 'Failed to delete brief' };
    }
}
