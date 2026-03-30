import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news.service';

export const useNews = (params?: Parameters<typeof newsService.getAll>[0]) => {
    return useQuery({
        queryKey: ['news', params],
        queryFn: () => newsService.getAll(params),
    });
};

export const useInfiniteNews = (params?: { limit?: number; category?: string; authorId?: string; sort?: string; featured?: boolean; search?: string; tag?: string; lang?: string }) => {
    return useInfiniteQuery({
        queryKey: ['news', 'infinite', params],
        queryFn: ({ pageParam = 1 }) => newsService.getAll({
            ...params,
            author_id: params?.authorId,
            page: pageParam as number,
            lang: params?.lang
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !lastPage.newsList) {
                return undefined;
            }
            // If the current page has fewer items than the limit, assume there are no more pages
            const limit = params?.limit || 10;
            if (lastPage.newsList.length < limit) {
                return undefined;
            }
            return allPages.length + 1;
        },
    });
};

export const useNewsBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['news', slug],
        queryFn: () => newsService.getBySlug(slug),
        enabled: !!slug,
    });
};
