'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Card from '@/components/common/Card';
import { useInfiniteNews } from '@/hooks/queries/useNews';

interface InfiniteNewsListProps {
    category?: string;
    authorId?: string;
    sort?: string;
    search?: string;
    tag?: string;
}

export default function InfiniteNewsList({ category, authorId, sort, search, tag }: InfiniteNewsListProps) {
    const { ref, inView } = useInView();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteNews({ limit: 12, category, authorId, sort, search, tag });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col gap-4">
                        <div className="bg-gray-100 aspect-video rounded-sm" />
                        <div className="h-6 bg-gray-100 w-3/4" />
                        <div className="h-20 bg-gray-100 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div className="py-20 text-center text-red-500 font-bold font-main italic">খবর লোড করতে সমস্যা হয়েছে!</div>;
    }

    const allNews = data?.pages.flatMap((page) => page.newsList || []) || [];

    if (allNews.length === 0) {
        return <div className="py-20 text-center text-gray-400 font-bold font-main italic">কোনো খবর পাওয়া যায়নি!</div>;
    }

    return (
        <section className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                {allNews.map((article) => (
                    <Card key={article.id} article={article} variant="medium" />
                ))}
            </div>

            {/* Intersection Observer Target */}
            <div ref={ref} className="h-20 mt-10 flex justify-center items-center">
                {isFetchingNextPage && (
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                )}
                {!hasNextPage && allNews.length > 0 && (
                    <p className="text-gray-400 font-bold font-main italic border-t border-gray-100 pt-8 w-full text-center">সব খবর শেষ!</p>
                )}
            </div>
        </section>
    );
}
