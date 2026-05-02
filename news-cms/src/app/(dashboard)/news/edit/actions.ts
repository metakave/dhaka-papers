'use server';

import { api } from '@/lib/api';
import { News } from '@/types';

export async function getNewsBySlug(slug: string): Promise<News | { error: string }> {
    try {
        const response = await api.get(`/news/${slug}`);
        return response.data;
    } catch (error: any) {
        return { error: 'Failed to fetch news' };
    }
}
