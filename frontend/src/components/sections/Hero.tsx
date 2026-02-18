'use client';

import Link from 'next/link';
import Card from '@/components/common/Card';
import { News } from '@/types/news';

interface HeroProps {
    featured: News | null;
    latest: News[];
    isLoading: boolean;
}

export default function Hero({ featured: mainArticle, latest, isLoading }: HeroProps) {

    if (isLoading) {
        return <div className="py-20 text-center text-gray-400 font-bold italic">সংবাদ লোড হচ্ছে...</div>;
    }

    // Hero uses first 3 for side list (right) and next 2 for secondary (under main)
    // latest list from props is already filtered by backend
    const sideArticles = latest.slice(0, 3);
    const secondaryArticles = latest.slice(3, 5);

    return (
        <section className="py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Impactful Story */}
                <div className="lg:col-span-8 border-r border-transparent lg:border-gray-100 lg:pr-10">
                    {mainArticle ? (
                        <div className="flex flex-col gap-6">
                            <Card article={mainArticle} variant="large" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 border-t border-gray-100 pt-8">
                                {secondaryArticles.map(article => (
                                    <Card key={article.id} article={article} variant="medium" />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center bg-gray-50 text-gray-400 italic">কোনো বিশেষ খবর পাওয়া যায়নি</div>
                    )}
                </div>

                {/* Side High-Density List */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gray-50 p-4 border-l-4 border-primary">
                        <h3 className="text-xl font-black uppercase tracking-tighter">সর্বশেষ খবর</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        {sideArticles.map(article => (
                            <Card key={article.id} article={article} variant="hero-side" />
                        ))}
                    </div>

                    <Link href="/news" className="text-center py-3 border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors uppercase tracking-widest mt-2">
                        সকল সংবাদ দেখুন
                    </Link>
                </div>
            </div>
        </section>
    );
}
