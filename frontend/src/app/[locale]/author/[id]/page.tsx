'use client';

import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';
import { useInfiniteNews } from '@/hooks/queries/useNews';

export default function AuthorPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";
    const authorId = params?.id as string;

    // We use the same hook to get the first page of news so we can extract the author name
    const { data } = useInfiniteNews({ limit: 1, authorId, lang: locale });
    const authorName = data?.pages[0]?.newsList[0]?.author_name || (locale === "bn" ? "লেখক" : "Author");

    return (
        <Layout>
            <div className="py-8 md:py-12">
                <div className="border-b-4 border-primary mb-12">
                    <div className="flex flex-col gap-2 py-4">
                        <span className="text-gray-500 uppercase tracking-widest text-sm font-black">
                            {locale === "bn" ? "নিবন্ধসমূহ" : "Articles"}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                            {authorName}
                        </h1>
                    </div>
                </div>

                <InfiniteNewsList authorId={authorId} />
            </div>
        </Layout>
    );
}
