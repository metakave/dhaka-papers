'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'next/navigation';
import Card from '@/components/common/Card';
import { BriefCard } from '@/components/sections/NewsBriefs';
import { useInfiniteNews } from '@/hooks/queries/useNews';

interface InfiniteNewsListProps {
    category?: string;
    authorId?: string;
    sort?: string;
    search?: string;
    tag?: string;
    isBrief?: boolean;
}

export default function InfiniteNewsList({ category, authorId, sort, search, tag, isBrief }: InfiniteNewsListProps) {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';
    const { ref, inView } = useInView();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useInfiniteNews({ limit: 12, category, authorId, sort, search, tag, isBrief, lang: locale });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                        <div className="aspect-video bg-gray-100" />
                        <div className="h-3 bg-gray-100 w-20" />
                        <div className="h-4 bg-gray-100" />
                        <div className="h-4 bg-gray-100 w-4/5" />
                        <div className="h-3 bg-gray-100 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-16 text-center text-red-500 font-bold italic">
                {locale === 'bn' ? 'খবর লোড করতে সমস্যা হয়েছে!' : 'Something went wrong loading news!'}
            </div>
        );
    }

    const allNews = data?.pages.flatMap(page => page.newsList || []) || [];

    if (allNews.length === 0) {
        return (
            <div className="py-16 text-center text-gray-400 font-bold italic">
                {locale === 'bn' ? 'কোনো খবর পাওয়া যায়নি!' : 'No news found!'}
            </div>
        );
    }

    return (
        <section>
            <div className={isBrief 
                ? "grid grid-cols-1 md:grid-cols-2 gap-8" 
                : "grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8"
            }>
                {allNews.map(article => (
                    isBrief ? (
                        <BriefCard key={article.id} brief={article} />
                    ) : (
                        <Card key={article.id} article={article} variant="grid" />
                    )
                ))}
            </div>

            <div ref={ref} className="h-16 mt-8 flex justify-center items-center">
                {isFetchingNextPage && (
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                )}
                {!hasNextPage && allNews.length > 0 && (
                    <p className="text-gray-400 text-sm font-medium border-t border-gray-100 pt-6 w-full text-center">
                        {locale === 'bn' ? 'সব খবর শেষ' : 'All news loaded'}
                    </p>
                )}
            </div>
        </section>
    );
}
