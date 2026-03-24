import api from '@/lib/api';
import { News, NewsListResponse } from '@/types/news';

export const newsService = {
    getAll: async (params?: { page?: number; limit?: number; category?: string; author_id?: string; sort?: string; featured?: boolean; search?: string; tag?: string }) => {
        const { data } = await api.get<NewsListResponse>('/news', { params });
        return data;
    },

    getBySlug: async (slug: string) => {
        const { data } = await api.get<News>(`/news/${slug}`);
        return data;
    },
};
