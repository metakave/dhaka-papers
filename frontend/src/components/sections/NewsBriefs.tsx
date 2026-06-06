'use client';
// Build timestamp: 2026-05-12T17:01


import { News } from '@/types/news';
import { useParams } from 'next/navigation';

interface BriefItem {
    title: string;
    description: string;
}

interface NewsBriefsProps {
    news: News[];
}

function parseBriefItems(content: string): BriefItem[] | null {
    if (!content) return null;
    
    // Helper to try parsing a string
    const tryParse = (str: string) => {
        try {
            const trimmed = str.trim();
            if (!trimmed.startsWith('[')) return null;
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed) && parsed.length > 0 && 'title' in parsed[0]) {
                return parsed as BriefItem[];
            }
        } catch {
            return null;
        }
        return null;
    };

    // 1. Try direct parse
    let result = tryParse(content);
    if (result) return result;

    // 2. Try unescaping common HTML entities
    const unescaped = content
        .replace(/&quot;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&#x22;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#38;/g, '&');
    
    result = tryParse(unescaped);
    if (result) return result;

    return null;
}

export function BriefCard({ brief, isScrollable = false }: { brief: News; isScrollable?: boolean }) {
    const params = useParams();
    const locale = (params.locale as string) || 'bn';
    const items = brief?.content ? parseBriefItems(brief.content) : null;

    return (
        <div className="bg-white border-t-4 border-[#b91c1c] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full min-h-[300px]">
            {/* Header / Title Area */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-[#b91c1c] font-black text-xl leading-tight">
                    {brief.title}
                </h3>
            </div>

            {/* Content Area */}
            <div className={`flex-1 p-5 ${isScrollable ? 'overflow-y-auto custom-scrollbar min-h-0' : ''}`}>
                {items && items.length > 0 ? (
                    <div className="space-y-6">
                        {items.map((item, idx) => (
                            <div key={idx} className="group">
                                {/* Title with subtle dot */}
                                <div className="flex gap-3 mb-2">
                                    <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 bg-[#b91c1c] rounded-full group-hover:scale-125 transition-transform" />
                                    <h4 className="text-gray-900 font-bold text-base leading-snug group-hover:text-[#b91c1c] transition-colors">
                                        {item.title}
                                    </h4>
                                </div>
                                {/* Description */}
                                {item.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed pl-4.5 border-l border-gray-100 ml-[3px]">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : brief?.content ? (
                    <div
                        className="prose prose-sm max-w-none
                            [&_h4]:text-[#b91c1c] [&_h4]:text-base [&_h4]:font-bold [&_h4]:mb-2 [&_h4]:mt-6 first:[&_h4]:mt-0
                            [&_h3]:text-[#b91c1c] [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-6 first:[&_h3]:mt-0
                            [&_p]:text-gray-700 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4
                        "
                        dangerouslySetInnerHTML={{ __html: brief.content }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                        <p className="text-sm italic">
                            {locale === 'bn' ? 'কোনো তথ্য নেই' : 'No information available'}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer with timestamp */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-medium mt-auto">
                <span className="uppercase tracking-wider">
                    {locale === 'bn' ? 'সংবাদ সংক্ষেপ' : 'NEWS BRIEF'}
                </span>
                {brief?.published_at && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        {new Date(brief.published_at).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function NewsBriefs({ news }: NewsBriefsProps) {
    const brief = news.length > 0 ? news[0] : null;

    if (!brief) {
        return (
            <div className="border border-gray-100 bg-gray-50 flex items-center justify-center h-[300px] text-gray-400 text-sm italic rounded-sm">
                No news briefs found
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto h-full">
             <BriefCard brief={brief} isScrollable={true} />
        </div>
    );
}
