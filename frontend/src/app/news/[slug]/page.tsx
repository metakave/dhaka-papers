'use server';

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { notFound } from 'next/navigation';
import { newsService } from '@/services/news.service';
import SocialShare from '@/components/common/SocialShare';
import { Metadata } from 'next';
import { getBengaliDayMonthYear } from '@/utils/dateUtils';
import ArticleMeta from '@/components/news/ArticleMeta';
import NewsBody from '@/components/news/NewsBody';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;
    const article = await newsService.getBySlug(slug);

    if (!article) return { title: 'Not Found' };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dhakapapers.com';
    const ogImage = article.thumbnail || `${baseUrl}/placeholder-news.jpg`;

    return {
        title: `${article.title} | ঢাকা পেপারস`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${baseUrl}/news/${slug}`,
            siteName: 'ঢাকা পেপারস',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            locale: 'bn_BD',
            type: 'article',
            publishedTime: article.published_at,
            authors: [article.author_name || 'Dhaka Papers'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [ogImage],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    let article;
    try {
        article = await newsService.getBySlug(slug);
    } catch (e) {
        notFound();
    }

    if (!article) {
        notFound();
    }

    const { newsList: categoryNews } = await newsService.getAll({ category: article.category_slug, limit: 10 });
    const { newsList: latestNews } = await newsService.getAll({ limit: 10 });

    const filteredCategoryNews = categoryNews?.filter(a => a.id !== article.id) || [];
    const filteredLatestNews = latestNews?.filter(a => a.id !== article.id) || [];
    const relatedNews = (filteredCategoryNews.length > 0 ? filteredCategoryNews : filteredLatestNews).slice(0, 3);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dhakapapers.com';
    const shareUrl = `${baseUrl}/news/${slug}`;

    return (
        <Layout>
            <article className="max-w-[850px] mx-auto py-6 md:py-10 px-4 sm:px-6">
                <Link href={`/${article.category_slug}`} className="text-primary font-bold text-sm md:text-base mb-6 inline-block hover:underline uppercase tracking-widest">
                    {article.category_name_bn || article.category_name}
                </Link>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900">
                    {article.title}
                </h1>

                <ArticleMeta
                    authorName={article.author_name || 'Anonymous'}
                    authorId={article.author_id}
                    published_at={article.published_at}
                    updated_at={article.updated_at}
                />

                <div className="mb-12">
                    <div className="aspect-video relative rounded-sm overflow-hidden shadow-2xl bg-gray-100">
                        <Image
                            src={article.thumbnail || '/placeholder-news.jpg'}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                    {article.thumbnail_caption && (
                        <div className="mt-4 flex">
                            <p className="text-sm md:text-base font-medium italic text-gray-500">
                                {article.thumbnail_caption}
                            </p>
                        </div>
                    )}
                </div>

                <SocialShare title={article.title} url={shareUrl} />

                <NewsBody content={article.content} excerpt={article.excerpt} />

                {article.tags && article.tags.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        {article.tags.map((tag: string, index: number) => (
                            <Link href={`/tag/${encodeURIComponent(tag)}`} key={index} className="bg-gray-100 px-4 py-2 rounded-full text-gray-800 font-medium text-sm md:text-base border border-gray-200 hover:bg-primary hover:text-white transition-colors flex items-center gap-1 group">
                                <span className="text-gray-400 group-hover:text-white/80 transition-colors">#</span>
                                {tag}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="my-12">
                    <SocialShare title={article.title} url={shareUrl} />
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
