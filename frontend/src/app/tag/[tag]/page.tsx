'use client';

import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';

export default function TagPage() {
    const params = useParams();
    const rawTag = params?.tag as string;
    const decodedTag = rawTag ? decodeURIComponent(rawTag) : '';

    return (
        <Layout>
            <div className="py-8 md:py-12">
                <div className="border-b-4 border-primary mb-12">
                    <h1 className="text-4xl md:text-5xl font-black py-4 uppercase tracking-tighter italic flex items-center gap-2">
                        <span className="text-gray-400">#</span>
                        {decodedTag}
                    </h1>
                </div>

                <InfiniteNewsList tag={decodedTag} />
            </div>
        </Layout>
    );
}
