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
    const locale = (params.locale as string) || 'bn';

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

    if (news.length === 0) return null;

    return (
        <section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
                {news.map(article => (
                    <Card key={article.id} article={article} variant="grid" />
                ))}
            </div>
            <div className="mt-10 flex justify-center">
                <Link href="/news" className="px-8 py-3 border border-gray-300 text-sm font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest">
                    {locale === 'bn' ? 'আরও খবর পড়ুন' : 'Read More News'}
                </Link>
            </div>
        </section>
    );
}
