'use client';

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { notFound, useParams } from 'next/navigation';
import { useNews, useNewsBySlug } from '@/hooks/queries/useNews';

export default function ArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { data: article, isLoading, isError } = useNewsBySlug(slug);
    const { data: categoryNews } = useNews({ category: article?.category_slug, limit: 4 });
    const { data: latestNews } = useNews({ limit: 4 });

    if (isLoading) {
        return <div className="py-20 text-center text-gray-400 font-bold italic">খবর লোড হচ্ছে...</div>;
    }

    if (isError || !article) {
        notFound();
    }

    // Format date in Bengali with consistent month spelling
    const formatBengaliDate = (dateStr: string) => {
        const bnMonths = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
        const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        const toBengaliNumber = (num: number) => String(num).split("").map(d => bnDigits[parseInt(d)]).join("");
        const date = new Date(dateStr);
        return `${toBengaliNumber(date.getDate())} ${bnMonths[date.getMonth()]}, ${toBengaliNumber(date.getFullYear())}`;
    };
    const formattedDate = formatBengaliDate(article.published_at);

    const filteredCategoryNews = categoryNews?.newsList?.filter(a => a.id !== article.id) || [];
    const filteredLatestNews = latestNews?.newsList?.filter(a => a.id !== article.id) || [];

    const relatedNews = (filteredCategoryNews.length > 0 ? filteredCategoryNews : filteredLatestNews).slice(0, 3);

    return (
        <Layout>
            <article className="max-w-[850px] mx-auto py-6 md:py-10">
                <Link href={`/${article.category_slug}`} className="text-primary font-bold text-sm md:text-base mb-6 inline-block hover:underline uppercase tracking-widest">
                    {article.category_name}
                </Link>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900">
                    {article.title}
                </h1>

                <div className="flex items-center gap-4 mb-10 border-y border-gray-100 py-6">
                    <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center font-black text-white text-xl">
                        {article.author_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <Link href={`/author/${article.author_id}`} className="font-black text-gray-900 text-lg hover:border-b-2 border-gray-900 transition-all block w-fit">
                            {article.author_name}
                        </Link>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{formattedDate}</p>
                    </div>
                </div>

                <div className="aspect-video relative mb-12 rounded-sm overflow-hidden shadow-2xl bg-gray-100">
                    <Image
                        src={article.thumbnail || '/placeholder-news.jpg'}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="prose prose-xl prose-red max-w-none text-gray-800 leading-[1.8] font-medium">
                    <p className="font-black text-2xl md:text-3xl mb-10 text-gray-900 border-l-8 border-primary pl-8 py-4 bg-gray-50 leading-tight italic">
                        {article.excerpt}
                    </p>

                    {/* Rich Text Content from Backend (Sanitized) */}
                    <div
                        className="tiptap mb-12"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                <div className="mt-24 border-t-2 border-gray-900 pt-16">
                    <h3 className="text-3xl font-black mb-12 flex items-center gap-4">
                        <span className="w-3 h-8 bg-primary"></span>
                        আরও পড়ুন
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                        {relatedNews.map(a => (
                            <Link key={a.id} href={`/news/${a.slug}`} className="group flex flex-col gap-4">
                                <div className="aspect-video relative rounded-sm overflow-hidden bg-gray-100">
                                    <Image src={a.thumbnail || '/placeholder-news.jpg'} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h4 className="font-black text-xl group-hover:text-primary transition-colors leading-tight">{a.title}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            </article>
        </Layout>
    );
}
