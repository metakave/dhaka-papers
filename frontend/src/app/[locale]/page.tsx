'use client';

import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import NewsGrid from '@/components/sections/NewsGrid';
import { useHomepage } from '@/hooks/queries/useHomepage';
import { toBengaliNumber } from '@/utils/dateUtils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Home() {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';
    const { data, isLoading } = useHomepage(locale);

    // Hero: featured + latest[0..3] right grid
    // Grid section: latest[4..]
    const gridItems = data?.latest?.slice(4) || [];

    return (
        <Layout>
            <Hero
                featured={data?.featured || null}
                latest={data?.latest || []}
                isLoading={isLoading}
            />

            {/* Latest News 3-column section */}
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-gray-900">
                    <div className="w-1 h-5 bg-primary flex-shrink-0" />
                    <h2 className="text-lg font-black uppercase tracking-tight">
                        {locale === 'bn' ? 'সর্বশেষ খবর' : 'Latest News'}
                    </h2>
                </div>
                <NewsGrid news={gridItems} isLoading={isLoading} />
            </div>

            {/* Most Popular */}
            {(isLoading || (data?.popular && data.popular.length > 0)) && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-5 bg-primary flex-shrink-0" />
                        <h2 className="text-lg font-black uppercase tracking-tight">
                            {locale === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4">
                        {isLoading
                            ? [...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse flex gap-3 items-start py-2 border-b border-gray-100">
                                    <div className="h-8 w-6 bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 bg-gray-100 w-full" />
                                        <div className="h-4 bg-gray-100 w-3/4" />
                                    </div>
                                </div>
                            ))
                            : data?.popular?.map((news, idx) => (
                                <Link
                                    key={news.id}
                                    href={`/news/${news.slug}`}
                                    className="flex gap-3 items-start py-3 border-b border-gray-100 group"
                                >
                                    <span className="text-2xl font-black text-gray-300 group-hover:text-primary transition-colors leading-none flex-shrink-0 w-6 text-center">
                                        {locale === 'bn' ? toBengaliNumber(idx + 1) : idx + 1}
                                    </span>
                                    <p className="text-sm font-bold leading-snug text-gray-800 group-hover:text-primary transition-colors line-clamp-3">
                                        {news.title}
                                    </p>
                                </Link>
                            ))}
                    </div>
                </div>
            )}
        </Layout>
    );
}
