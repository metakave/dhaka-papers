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
    const author = data?.pages[0]?.newsList[0];
    const authorName = locale === "en" 
        ? (author?.author_name_en || author?.author_name || "Author") 
        : (author?.author_name || "লেখক");
    const authorProfileImage = author?.author_profile_image;
    const authorHideProfileImage = author?.author_hide_profile_image;

    return (
        <Layout>
            <div className="py-8 md:py-12 px-4 max-w-[1240px] mx-auto">
                <div className="border-b-4 border-primary mb-12">
                    <div className="flex flex-col md:flex-row gap-6 py-6 md:items-center">
                        {!authorHideProfileImage && authorProfileImage && (
                            <img 
                                src={authorProfileImage} 
                                alt={authorName} 
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-primary/20"
                            />
                        )}
                        <div className="flex flex-col gap-2">
                            <span className="text-gray-500 uppercase tracking-widest text-sm font-black">
                                {locale === "bn" ? "নিবন্ধসমূহ" : "Articles"}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                                {authorName}
                            </h1>
                        </div>
                    </div>
                </div>

                <InfiniteNewsList authorId={authorId} />
            </div>
        </Layout>
    );
}
