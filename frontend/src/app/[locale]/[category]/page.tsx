'use client';

import Layout from '@/components/layout/Layout';
import { notFound, useParams } from 'next/navigation';
import { useCategories } from '@/hooks/queries/useCategories';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';
import PaginatedNewsBriefsList from '@/components/sections/PaginatedNewsBriefsList';
import { Suspense } from 'react';

export default function CategoryPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";
    const categorySlug = params?.category as string;

    const { data: categories, isLoading: isCatsLoading } = useCategories();

    if (isCatsLoading) {
        return <div className="py-20 text-center text-gray-400 font-bold italic">
            {locale === "bn" ? "খবর লোড হচ্ছে..." : "Loading news..."}
        </div>;
    }

    const category = categories?.find((c) => c.slug === categorySlug);
    if (!category) {
        notFound();
    }

    return (
        <Layout>
            <div className="py-8 md:py-12">
                <div className="border-b-4 border-primary mb-12">
                    <h1 className="text-4xl md:text-5xl font-black py-4 uppercase tracking-tighter italic">
                        {locale === "en" ? category.name : (category.name_bn || category.name)}
                    </h1>
                </div>

                {categorySlug === 'news-briefs' ? (
                    <Suspense fallback={
                        <div className="py-20 text-center text-gray-400 font-bold italic">
                            {locale === "bn" ? "সংবাদ সংক্ষেপ লোড হচ্ছে..." : "Loading news briefs..."}
                        </div>
                    }>
                        <PaginatedNewsBriefsList />
                    </Suspense>
                ) : (
                    <InfiniteNewsList category={categorySlug} isBrief={categorySlug === 'news-briefs'} />
                )}
            </div>
        </Layout>
    );
}
