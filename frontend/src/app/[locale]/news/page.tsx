'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';

import { useParams } from 'next/navigation';

export default function LatestNewsPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";

    return (
        <Layout>
            <div className="py-10 md:py-16">
                <div className="flex flex-col gap-6 mb-16 border-b-2 border-gray-900 pb-12">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-gray-900">
                        {locale === "bn" ? "সাম্প্রতিক খবর" : "Recent News"}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-bold max-w-2xl leading-relaxed">
                        {locale === "bn" 
                            ? "দেশ ও বিদেশের সর্বশেষ সব খবরের নিয়মিত আপডেট। সব সময় সবার আগে সঠিক খবর পেতে আমাদের সাথেই থাকুন।" 
                            : "Stay updated with the latest news from around the world. Follow us to get the most accurate news first."}
                    </p>
                </div>

                <InfiniteNewsList />
            </div>
        </Layout>
    );
}
