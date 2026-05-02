'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/news';
import { memo } from 'react';
import { useParams } from 'next/navigation';
import { getRelativeTimeBengali } from '@/utils/dateUtils';

interface CardProps {
    article: News;
    variant?: 'featured' | 'grid' | 'hero-side' | 'large' | 'medium' | 'small' | 'list';
}

const Card = memo(({ article, variant = 'grid' }: CardProps) => {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';
    const timeAgo = getRelativeTimeBengali(article.published_at, locale);
    const categoryName =
        locale === 'bn'
            ? article.category_name_bn || article.category_name
            : article.category_name || article.category_name_bn;

    // Normalize legacy variant names
    const v =
        variant === 'large'
            ? 'featured'
            : variant === 'medium' || variant === 'small' || variant === 'list'
            ? 'grid'
            : variant;

    if (v === 'featured') {
        return (
            <article className="group">
                <Link href={`/news/${article.slug}`} className="block relative overflow-hidden aspect-video bg-gray-100 mb-3">
                    <Image
                        src={article.thumbnail || '/placeholder-news.jpg'}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
                {categoryName && (
                    <Link href={`/${article.category_slug}`} className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block hover:underline">
                        {categoryName}
                    </Link>
                )}
                <Link href={`/news/${article.slug}`}>
                    <h2 className="text-2xl md:text-3xl font-black leading-snug text-gray-900 hover:text-primary transition-colors mb-3">
                        {article.title}
                    </h2>
                </Link>
                {article.excerpt && (
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3 line-clamp-3">
                        {article.excerpt}
                    </p>
                )}
                <span className="text-gray-400 text-xs">{timeAgo}</span>
            </article>
        );
    }

    if (v === 'hero-side') {
        return (
            <article className="group flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <Link href={`/news/${article.slug}`} className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                    <Image
                        src={article.thumbnail || '/placeholder-news.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    {categoryName && (
                        <Link href={`/${article.category_slug}`} className="text-primary text-[11px] font-bold uppercase tracking-widest mb-1 block hover:underline truncate">
                            {categoryName}
                        </Link>
                    )}
                    <Link href={`/news/${article.slug}`}>
                        <h3 className="text-sm font-bold leading-snug text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-1">
                            {article.title}
                        </h3>
                    </Link>
                    <span className="text-gray-400 text-xs">{timeAgo}</span>
                </div>
            </article>
        );
    }

    // Default: grid
    return (
        <article className="group">
            <Link href={`/news/${article.slug}`} className="block relative overflow-hidden aspect-video bg-gray-100 mb-3">
                <Image
                    src={article.thumbnail || '/placeholder-news.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>
            {categoryName && (
                <Link href={`/${article.category_slug}`} className="text-primary text-[11px] font-bold uppercase tracking-widest mb-1.5 block hover:underline">
                    {categoryName}
                </Link>
            )}
            <Link href={`/news/${article.slug}`}>
                <h2 className="text-base md:text-lg font-black leading-snug text-gray-900 hover:text-primary transition-colors mb-2 line-clamp-3">
                    {article.title}
                </h2>
            </Link>
            <span className="text-gray-400 text-xs">{timeAgo}</span>
        </article>
    );
});

Card.displayName = 'Card';
export default Card;
