'use client';

import React, { useState, useMemo } from 'react';

type ReportItem = {
    id: string;
    title: string;
    date_str: string;
    details: string;
    serial_number: number;
};

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const cleanStr = dateStr.replace(/\\-/g, '-').trim();
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const fullYear = year.length === 2 ? `20${year}` : year;
        const months: Record<string, string> = {
            'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
            'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
            'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
        };
        const fullMonth = months[month] || month;
        return `${fullMonth} ${parseInt(day, 10)}, ${fullYear}`;
    }
    return cleanStr;
}

export default function InteractiveAnalysis({ items }: { items: ReportItem[] }) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'demographics'>('timeline');

    // Simple analysis calculations
    const stats = useMemo(() => {
        const total = items.length;
        let youthCount = 0; // Under 30
        let middleCount = 0; // 30-50
        let elderCount = 0; // 50+

        // Timeline - array of groups [{ period: "Sep 2024", items: [] }]
        // 1. group by month-year
        const groups: Record<string, ReportItem[]> = {};

        // Month sorting helper
        const parseDateForSort = (dateStr: string) => {
            const cleanStr = dateStr.replace(/\\-/g, '-').trim();
            const parts = cleanStr.split('-');
            if (parts.length === 3) {
                const months: Record<string, number> = {
                    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
                    'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
                    'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                };
                const y = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2], 10);
                const m = months[parts[1]] || 0;
                return new Date(y, m, parseInt(parts[0], 10)).getTime();
            }
            return 0;
        };

        const sortedItems = [...items].sort((a, b) => parseDateForSort(a.date_str) - parseDateForSort(b.date_str));

        sortedItems.forEach(item => {
            // Extract age if available (e.g., "Name (25)")
            const ageMatch = item.title.match(/\((\d+)\)/);
            if (ageMatch) {
                const age = parseInt(ageMatch[1], 10);
                if (age < 30) youthCount++;
                else if (age <= 50) middleCount++;
                else elderCount++;
            }

            const cleanStr = item.date_str.replace(/\\-/g, '-').trim();
            const parts = cleanStr.split('-');
            if (parts.length >= 2) {
                const year = parts[2] ? (parts[2].length === 2 ? `20${parts[2]}` : parts[2]) : '';
                const monthYear = `${parts[1]} ${year}`.trim();
                if (!groups[monthYear]) groups[monthYear] = [];
                groups[monthYear].push(item);
            } else {
                if (!groups["Unknown"]) groups["Unknown"] = [];
                groups["Unknown"].push(item);
            }
        });

        // Convert groups object to array maintaining chronological order we just created
        const timelineGroups = Object.keys(groups).map(key => ({
            period: key,
            items: groups[key]
        }));

        return { total, youthCount, middleCount, elderCount, timelineGroups };
    }, [items]);

    return (
        <section className="max-w-6xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white tracking-widest uppercase">Data & Analysis</h2>

            <div className="flex justify-center gap-4 mb-12">
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`px-6 py-2 font-mono text-sm border transition-colors ${activeTab === 'timeline' ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-400 hover:text-white'}`}
                >
                    TIMELINE
                </button>
                <button
                    onClick={() => setActiveTab('demographics')}
                    className={`px-6 py-2 font-mono text-sm border transition-colors ${activeTab === 'demographics' ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-400 hover:text-white'}`}
                >
                    DEMOGRAPHICS
                </button>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-8 min-h-[400px]">
                {activeTab === 'timeline' && (
                    <div className="animate-fade-in w-full overflow-x-auto pb-8">
                        <div className="flex gap-4 md:gap-8 items-end h-[300px] mt-12 min-w-max px-4">
                            {stats.timelineGroups.map((group) => (
                                <div key={group.period} className="flex flex-col items-center flex-shrink-0 w-20">
                                    <div className="flex flex-col-reverse gap-1 justify-end h-full w-full pb-4">
                                        {group.items.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className="w-full h-2 md:h-3 bg-red-600/60 hover:bg-red-500 cursor-pointer relative group/dot transition-colors border-b border-black"
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black p-3 rounded shadow-2xl opacity-0 invisible group-hover/dot:opacity-100 group-hover/dot:visible transition-all z-50 w-48 pointer-events-none">
                                                    <p className="font-bold text-sm leading-tight mb-1">{item.title}</p>
                                                    <p className="text-xs font-mono text-red-600">{formatDate(item.date_str)}</p>
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-800 w-full text-center pt-2">
                                        <div className="text-xs text-gray-400 font-mono rotate-[-45deg] origin-top-left translate-y-2 whitespace-nowrap">{group.period}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-gray-500 text-sm mt-16 font-mono tracking-widest uppercase">
                            Each block represents a verified victim
                        </p>
                    </div>
                )}

                {activeTab === 'demographics' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[300px]">
                        <div className="flex flex-wrap gap-12 lg:gap-24 w-full justify-center mt-4">
                            <div className="text-center group">
                                <p className="text-6xl md:text-8xl font-black text-white group-hover:text-red-500 transition-colors">{stats.youthCount}</p>
                                <p className="text-sm text-gray-400 font-mono mt-4 uppercase tracking-widest">Under 30</p>
                            </div>
                            <div className="text-center group">
                                <p className="text-6xl md:text-8xl font-black text-white group-hover:text-red-500 transition-colors">{stats.middleCount}</p>
                                <p className="text-sm text-gray-400 font-mono mt-4 uppercase tracking-widest">30 to 50</p>
                            </div>
                            <div className="text-center group">
                                <p className="text-6xl md:text-8xl font-black text-white group-hover:text-red-500 transition-colors">{stats.elderCount}</p>
                                <p className="text-sm text-gray-400 font-mono mt-4 uppercase tracking-widest">Over 50</p>
                            </div>
                        </div>
                        <div className="mt-20 text-center">
                            <p className="text-xl md:text-2xl text-gray-400 font-light">Total Confirmed Victims: <span className="font-bold text-white ml-2">{stats.total}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
