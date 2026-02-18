'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { News, PaginatedResponse } from '@/types';

export async function getNewsAction(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
) {
    try {
        const session = await getAuthToken();
        if (!session) return { newsList: [], total: 0 };

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort: "latest",
        });

        if (category && category !== "all") queryParams.append("category", category);
        if (search) queryParams.append("search", search);

        const res = await api.get(`/news/admin?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${session}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return { newsList: [], total: 0 };
    }
}

export async function getNewsBySlug(slug: string): Promise<News | { error: string }> {
    try {
        const response = await api.get(`/news/${slug}`);
        return response.data;
    } catch (error: any) {
        return { error: 'Failed to fetch news' };
    }
}

export async function createNewsAction(formData: FormData) {
    try {
        const session = await getAuthToken();
        if (!session) throw new Error("Unauthorized");

        await api.post("/news", formData, {
            headers: {
                Authorization: `Bearer ${session}`,
                "Content-Type": "multipart/form-data",
            },
        });

        revalidatePath("/news");
        return { success: true };
    } catch (error) {
        console.error("Error creating news:", error);
        return { success: false, error: "Failed to create news" };
    }
}

export async function updateNewsAction(id: string, formData: FormData) {
    try {
        const session = await getAuthToken();
        if (!session) throw new Error("Unauthorized");

        await api.put(`/news/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${session}`,
                "Content-Type": "multipart/form-data",
            },
        });

        revalidatePath("/news");
        return { success: true };
    } catch (error) {
        console.error("Error updating news:", error);
        return { success: false, error: "Failed to update news" };
    }
}

export async function deleteNewsAction(id: string) {
    try {
        const token = await getAuthToken();
        await api.delete(`/news/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        revalidatePath('/news');
        return { success: true };
    } catch (error: any) {
        return { error: error.response?.data?.message || 'Failed to delete news' };
    }
}
