'use client';

import Card from '@/components/common/Card';
import { News } from '@/types/news';
import { useParams } from 'next/navigation';

interface HeroProps {
    featured: News | null;
    latest: News[];
    isLoading: boolean;
}

export default function Hero({ featured, latest, isLoading }: HeroProps) {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';

    if (isLoading) {
        return (
            <section className="pb-8 border-b border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 animate-pulse space-y-3">
                        <div className="aspect-video bg-gray-100" />
                        <div className="h-3 bg-gray-100 w-20" />
                        <div className="h-7 bg-gray-100" />
                        <div className="h-7 bg-gray-100 w-4/5" />
                        <div className="h-4 bg-gray-100 w-full" />
                        <div className="h-4 bg-gray-100 w-3/4" />
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-2">
                                <div className="aspect-video bg-gray-100" />
                                <div className="h-3 bg-gray-100 w-16" />
                                <div className="h-4 bg-gray-100" />
                                <div className="h-4 bg-gray-100 w-4/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const rightArticles = latest.slice(0, 4);

    return (
        <section className="pb-8 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
                <div className="lg:col-span-7 lg:pr-6 lg:border-r lg:border-gray-200 mb-8 lg:mb-0">
                    {featured ? (
                        <Card article={featured} variant="featured" />
                    ) : (
                        <div className="aspect-video bg-gray-50 flex items-center justify-center text-gray-300 italic">
                            {locale === 'bn' ? 'no featured' : 'No featured news'}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        {rightArticles.map(article => (
                            <Card key={article.id} article={article} variant="grid" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
