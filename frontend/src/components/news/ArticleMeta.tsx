'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatBengaliDateTime } from '@/utils/dateUtils';

interface ArticleMetaProps {
    authorName: string;
    authorId: string;
    published_at: string;
    updated_at: string;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ authorName, authorId, published_at, updated_at }) => {
    const [showUpdated, setShowUpdated] = useState(false);
    
    const publishedDate = formatBengaliDateTime(published_at);
    const updatedDate = formatBengaliDateTime(updated_at);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-y border-gray-100 py-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center font-black text-white text-xl flex-shrink-0">
                    {authorName?.charAt(0) || 'A'}
                </div>
                <div>
                    <Link href={`/author/${authorId}`} className="font-black text-gray-900 text-lg hover:border-b-2 border-gray-900 transition-all block w-fit mb-1">
                        {authorName}
                    </Link>
                    <div 
                        className="flex items-center gap-2 text-sm text-gray-500 font-bold select-none cursor-pointer group"
                        onClick={() => setShowUpdated(!showUpdated)}
                        title="ক্লিক করে প্রকাশ/আপডেট সময় দেখুন"
                    >
                        <span className="group-hover:text-primary transition-colors flex items-center gap-2">
                            {showUpdated ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    আপডেট: {updatedDate}
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                    প্রকাশ: {publishedDate}
                                </>
                            )}
                        </span>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            পরিবর্তন করতে ক্লিক করুন
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleMeta;
