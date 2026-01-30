import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/news';
import React, { memo } from 'react';

interface CardProps {
    article: News;
    variant?: 'large' | 'medium' | 'small' | 'list' | 'hero-side';
}

const Card = memo(({ article, variant = 'medium' }: CardProps) => {
    const isLarge = variant === 'large';
    const isList = variant === 'list';
    const isSmall = variant === 'small';
    const isHeroSide = variant === 'hero-side';

    // Format date nicely
    const formattedDate = new Date(article.published_at).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className={`group flex flex-col ${isList ? 'flex-row gap-6 items-center' : 'gap-4'} ${isHeroSide ? 'border-b border-gray-100 pb-5 last:border-0' : ''}`}>
            {/* Image Container */}
            <Link href={`/news/${article.slug}`} className={`relative overflow-hidden rounded-sm block bg-gray-100 ${isList ? 'w-32 h-32 md:w-40 md:h-40 flex-shrink-0' : 'w-full aspect-video'}`}>
                <Image
                    src={article.thumbnail || '/placeholder-news.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </Link>

            {/* Content Container */}
            <div className="flex flex-col flex-1">
                <Link href={`/${article.category_slug}`} className="text-primary text-[13px] font-black mb-2 uppercase tracking-widest hover:underline">
                    {article.category_name}
                </Link>

                <Link href={`/news/${article.slug}`}>
                    <h2 className={`text-gray-900 font-black leading-[1.25] transition-colors duration-300 group-hover:text-primary font-main
                        ${isLarge ? 'text-3xl md:text-4xl mb-4' : 'text-lg md:text-xl mb-3'} 
                        ${isHeroSide ? 'text-base md:text-lg mb-2' : ''}`}>
                        {article.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                {(isLarge || (!isSmall && !isList && !isHeroSide)) && (
                    <p className={`text-gray-700 leading-relaxed font-main mb-4 
                        ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
                        {article.excerpt}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-gray-500 text-xs md:text-sm font-black uppercase tracking-tight mt-auto">
                    <span>{formattedDate}</span>
                </div>
            </div>
        </article>
    );
});

Card.displayName = 'Card';

export default Card;
