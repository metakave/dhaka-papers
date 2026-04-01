"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatBengaliDateTime } from '@/utils/dateUtils';

interface ArticleMetaProps {
    authorName: string;
    authorNameEn?: string;
    authorId: string;
    published_at: string;
    updated_at: string;
    authorProfileImage?: string;
    authorHideProfileImage?: boolean;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ authorName, authorNameEn, authorId, published_at, updated_at, authorProfileImage, authorHideProfileImage }) => {
    const params = useParams();
    const locale = (params?.locale as string) || 'bn';
    const [showUpdated, setShowUpdated] = useState(false);
    
    // Simple mapper for common Bengali author titles
    const formatAuthorName = (name: string, nameEn?: string) => {
        if (locale !== 'en') return name;
        
        // If we have an explicit English name from the database, use it
        if (nameEn && nameEn.trim() !== '') return nameEn;

        const nameMap: Record<string, string> = {
            'নিজস্ব প্রতিবেদক': 'Staff Reporter',
            'নিজস্ব প্রতিবেদক, ঢাকা': 'Staff Reporter, Dhaka',
            'স্টাফ রিপোর্টার': 'Staff Reporter',
            'আইটি ডেস্ক': 'IT Desk',
            'ক্রীড়া প্রতিবেদক': 'Sports Reporter',
            'সংস্কৃতি প্রতিবেদক': 'Culture Reporter',
            'নিজস্ব প্রতিনিধি': 'Our Correspondent',
            'অনলাইন ডেস্ক': 'Online Desk',
            'বিশেষ সংবাদদাতা': 'Special Correspondent',
            'নিজস্ব সংবাদদাতা': 'Own Correspondent',
            'উপকূলীয় প্রতিবেদক': 'Coastal Reporter',
            'জেলা প্রতিনিধি': 'District Correspondent',
            'ঢাকা প্রতিনিধি': 'Dhaka Correspondent',
            'চট্টগ্রাম প্রতিনিধি': 'Chittagong Correspondent',
            'সিলেট প্রতিনিধি': 'Sylhet Correspondent',
            'রাজশাহী প্রতিনিধি': 'Rajshahi Correspondent',
            'বরিশাল প্রতিনিধি': 'Barishal Correspondent',
            'খুলনা প্রতিনিধি': 'Khulna Correspondent',
            'রংপুর প্রতিনিধি': 'Rangpur Correspondent',
            'ময়মনসিংহ প্রতিনিধি': 'Mymensingh Correspondent'
        };

        for (const [bn, en] of Object.entries(nameMap)) {
            if (name.includes(bn)) {
                return name.replace(bn, en);
            }
        }
        return name;
    };

    const publishedDate = formatBengaliDateTime(published_at, locale);
    const updatedDate = formatBengaliDateTime(updated_at, locale);

    const labels = {
        published: locale === 'en' ? 'Published' : 'প্রকাশ',
        updated: locale === 'en' ? 'Updated' : 'আপডেট',
        toggleTitle: locale === 'en' ? 'Click to view published/updated time' : 'ক্লিক করে প্রকাশ/আপডেট সময় দেখুন',
        toggleHint: locale === 'en' ? 'Click to change' : 'পরিবর্তন করতে ক্লিক করুন'
    };


    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-y border-gray-100 py-6">
            <div className="flex items-center gap-4">
                {!authorHideProfileImage && authorProfileImage ? (
                    <img 
                        src={authorProfileImage} 
                        alt={authorName} 
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center font-black text-white text-xl flex-shrink-0">
                        {authorName?.charAt(0) || 'A'}
                    </div>
                )}
                <div>
                    <Link href={`/author/${authorId}`} className="font-black text-gray-900 text-lg hover:border-b-2 border-gray-900 transition-all block w-fit mb-1">
                        {formatAuthorName(authorName, authorNameEn)}
                    </Link>
                    <div 
                        className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-bold select-none cursor-pointer group whitespace-nowrap"
                        onClick={() => setShowUpdated(!showUpdated)}
                        title={labels.toggleTitle}
                    >
                        <span className="group-hover:text-primary transition-colors flex items-center gap-2 flex-nowrap">
                            {showUpdated ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    {labels.updated}: {updatedDate}
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                    {labels.published}: {publishedDate}
                                </>
                            )}
                        </span>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {labels.toggleHint}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleMeta;
