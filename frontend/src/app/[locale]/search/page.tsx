'use client';

import Layout from '@/components/layout/Layout';
import { useSearchParams, useParams } from 'next/navigation';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';
import { Suspense } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const params = useParams();
    const locale = params.locale as string || "bn";
    const query = searchParams.get('q') || '';

    return (
        <div className="py-8 md:py-12">
            <div className="border-b-4 border-primary mb-12">
                <h1 className="text-4xl md:text-5xl font-black py-4 uppercase tracking-tighter italic">
                    {locale === "bn" ? `সার্চ রেজাল্ট: "${query}"` : `Search Results: "${query}"`}
                </h1>
            </div>

            <InfiniteNewsList search={query} />
        </div>
    );
}

export default function SearchPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";
    return (
        <Layout>
            <Suspense fallback={<div className="py-20 text-center text-gray-400 font-bold italic">{locale === "bn" ? "লোড হচ্ছে..." : "Loading..."}</div>}>
                <SearchResults />
            </Suspense>
        </Layout>
    );
}
