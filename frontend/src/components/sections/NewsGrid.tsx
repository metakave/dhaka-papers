'use client';

import Card from '@/components/common/Card';
import Link from 'next/link';
import { News } from '@/types/news';
import { useParams } from 'next/navigation';

interface NewsGridProps {
    news: News[];
    isLoading: boolean;
}

export default function NewsGrid({ news, isLoading }: NewsGridProps) {
    const params = useParams();
    const locale = params.locale as string || "bn";
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

    return (
        <section className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                {news.map((article) => (
                    <Card key={article.id} article={article} variant="medium" />
                ))}
            </div>

            <div className="mt-24 flex justify-center">
                <Link href={`/news`} className="px-16 py-5 bg-gray-900 text-white font-black hover:bg-primary transition-all duration-300 rounded-sm uppercase tracking-[0.3em] text-sm shadow-xl hover:shadow-primary/20">
                    {locale === "bn" ? "আরও খবর পড়ুন" : "Read More News"}
                </Link>
            </div>
        </section>
    );
}
