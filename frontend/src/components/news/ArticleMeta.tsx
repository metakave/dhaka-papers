'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatBengaliDateTime } from '@/utils/dateUtils';

interface ArticleMetaProps {
    authorName: string;
    authorId: string;
    updated_at: string;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ authorName, authorId, updated_at }) => {
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
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold select-none">
                        <span>আপডেট: {updatedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleMeta;
