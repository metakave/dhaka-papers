'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useNews } from '@/hooks/queries/useNews';
import { BriefCard } from '@/components/sections/NewsBriefs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginatedNewsBriefsList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'bn';

    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam, 10) || 1 : 1;
    const limit = 7;

    const { data, isLoading, isError } = useNews({
        page: currentPage,
        limit,
        is_brief: true,
        lang: locale
    });

    const newsList = data?.newsList || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-4 border border-gray-100 rounded-lg p-6 bg-white shadow-sm h-[350px]">
                        <div className="h-6 bg-gray-100 w-1/3 rounded" />
                        <div className="h-4 bg-gray-100 w-full rounded" />
                        <div className="h-4 bg-gray-100 w-4/5 rounded" />
                        <div className="h-4 bg-gray-100 w-3/4 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-16 text-center text-red-500 font-bold italic">
                {locale === 'bn' ? 'খবর লোড করতে সমস্যা হয়েছে!' : 'Something went wrong loading news!'}
            </div>
        );
    }

    if (newsList.length === 0) {
        return (
            <div className="py-16 text-center text-gray-400 font-bold italic">
                {locale === 'bn' ? 'কোনো খবর পাওয়া যায়নি!' : 'No news found!'}
            </div>
        );
    }

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <section className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newsList.map(article => (
                    <BriefCard key={article.id} brief={article} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-gray-100">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2.5 rounded-full border transition-all ${
                            currentPage === 1
                                ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {getPageNumbers().map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`min-w-[42px] h-[42px] rounded-full text-sm font-bold transition-all border ${
                                    pageNum === currentPage
                                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105'
                                        : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            >
                                {locale === 'bn'
                                    ? pageNum.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)])
                                    : pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2.5 rounded-full border transition-all ${
                            currentPage === totalPages
                                ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </section>
    );
}
