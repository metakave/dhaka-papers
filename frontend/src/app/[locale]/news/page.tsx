'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';

export default function LatestNewsPage() {
    return (
        <Layout>
            <div className="py-10 md:py-16">
                <div className="flex flex-col gap-6 mb-16 border-b-2 border-gray-900 pb-12">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic text-gray-900">
                        সাম্প্রতিক খবর
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-bold max-w-2xl leading-relaxed">
                        দেশ ও বিদেশের সর্বশেষ সব খবরের নিয়মিত আপডেট। সব সময় সবার আগে সঠিক খবর পেতে আমাদের সাথেই থাকুন।
                    </p>
                </div>

                <InfiniteNewsList />
            </div>
        </Layout>
    );
}
