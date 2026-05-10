'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/news';
import { useParams } from 'next/navigation';

interface NewsBriefsProps {
    news: News[];
}

export default function NewsBriefs({ news }: NewsBriefsProps) {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';

    return (
        <div className="border border-gray-200 bg-white flex flex-col h-[400px]">
            {/* Header */}
            <div className="flex text-center bg-[#b91c1c] text-yellow-300 font-bold text-lg">
                <div className="py-2 px-4 flex-1">
                    {locale === 'bn' ? 'সংবাদ সংক্ষেপ' : 'News Briefs'}
                </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-3 space-y-4">
                {news.map((article) => (
                    <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="group flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div className="relative w-[80px] h-[55px] flex-shrink-0 overflow-hidden bg-gray-100">
                            <Image
                                src={article.thumbnail || '/placeholder-news.jpg'}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-primary transition-colors line-clamp-3">
                            {article.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* Footer button */}
            <Link
                href="/latest"
                className="bg-[#b91c1c] text-yellow-300 text-center py-2 font-bold text-lg hover:bg-red-800 transition-colors"
            >
                {locale === 'bn' ? 'সব খবর' : 'All News'}
            </Link>
        </div>
    );
}
