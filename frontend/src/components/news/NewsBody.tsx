'use client';

import React, { useState } from 'react';

interface NewsBodyProps {
    content: string;
    excerpt: string;
}

import { useParams } from 'next/navigation';

export default function NewsBody({ content, excerpt }: NewsBodyProps) {
    const params = useParams();
    const locale = (params?.locale as string) || 'bn';
    const [fontSize, setFontSize] = useState(18); // Default 18px (prose-xl equivalent)

    const adjustFontSize = (delta: number) => {
        setFontSize(prev => Math.min(Math.max(prev + delta, 14), 32));
    };

    const labels = {
        increase: locale === 'en' ? 'Increase' : 'বৃহৎ করুন',
        decrease: locale === 'en' ? 'Decrease' : 'ক্ষুদ্র করুন',
        plus: locale === 'en' ? 'A+' : 'অ+',
        minus: locale === 'en' ? 'A-' : 'অ-'
    };


    return (
        <div className="prose prose-xl prose-red max-w-none text-gray-800 leading-[1.8] font-medium">
            <div className="flex justify-end mb-6">
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full p-1 shadow-sm">
                    <button
                        onClick={() => adjustFontSize(2)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-gray-900 transition-all active:scale-95 group relative"
                        title={labels.increase}
                    >
                        <span className="text-sm font-bold">{labels.plus}</span>
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                    <button
                        onClick={() => adjustFontSize(-2)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-gray-900 transition-all active:scale-95"
                        title={labels.decrease}
                    >
                        <span className="text-sm font-bold">{labels.minus}</span>
                    </button>
                </div>
            </div>

            <p className="font-black text-2xl md:text-3xl mb-10 text-gray-900 border-l-8 border-primary pl-8 py-4 bg-gray-50 leading-tight italic">
                {excerpt}
            </p>

            <div
                className="tiptap mb-12 transition-all duration-300"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
