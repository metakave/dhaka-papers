import api from '@/lib/api';
import { News, NewsListResponse } from '@/types/news';

export const newsService = {
    getAll: async (params?: { page?: number; limit?: number; category?: string; author_id?: string; sort?: string; featured?: boolean; is_brief?: boolean; search?: string; tag?: string; lang?: string }) => {
        const { data } = await api.get<NewsListResponse>('/news', { params });
        return data;
    },

    getBySlug: async (slug: string, lang?: string) => {
        const { data } = await api.get<News>(`/news/${slug}`, { params: { lang } });
        return data;
    },
};
