import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { News } from '@/types/news';

export interface HomepageData {
    featured: News;
    latest: News[];
    popular: News[];
}

export const useHomepage = (lang?: string) => {
    return useQuery({
        queryKey: ['homepage', lang],
        queryFn: async () => {
            const { data } = await api.get<HomepageData>('/news/homepage', { params: { lang } });
            return data;
        },
    });
};
