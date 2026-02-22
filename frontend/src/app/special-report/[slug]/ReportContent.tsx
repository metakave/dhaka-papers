"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Calendar, MapPin, User,
    ArrowUpRight, Search, Shield
} from 'lucide-react';
import InViewAnimation from './InViewAnimation';
import TimelineScrubber from './TimelineScrubber';

interface Victim {
    id: number;
    title: string;
    details: string;
    date_str: string;
    image_url: string;
    qr_code_url: string;
    news_url: string;
    age: number;
    location: string;
}

interface ReportContentProps {
    items: Victim[];
}

// Reusable date formatter
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

function parseVictimDetails(details: string) {
    const metadataRegex = /(?:S\/O|SO):\s*(.+?)(?=\s*Address:|\s*Identity:|\s*[\u0980-\u09FF]|$)\s*(?:Address:\s*(.+?)(?=\s*Identity:|\s*[\u0980-\u09FF]|$))?\s*(?:Identity:\s*(.+?)(?=\s*[\u0980-\u09FF]|$))?/i;
    const match = details.match(metadataRegex);
    let so = '', address = '', identity = '', story = details;
    if (match) {
        so = match[1] ? match[1].trim() : '';
        address = match[2] ? match[2].trim() : '';
        identity = match[3] ? match[3].trim() : '';
        story = details.replace(match[0], '').trim();
    }
    return { so, address, identity, story };
}

export default function ReportContent({ items }: ReportContentProps) {
    const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageError = (url: string) => {
        setFailedImages(prev => new Set(prev).add(url));
    };

    useEffect(() => {
        if (selectedVictim) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedVictim]);

    // Filtering logic
    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    // Grouping by Month/Year for the Timeline
    const groupedItems = useMemo(() => {
        const groups: Record<string, Victim[]> = {};
        filteredItems.forEach(item => {
            const dateParts = item.date_str.split('-');
            if (dateParts.length === 3) {
                const key = `${dateParts[1]} ${dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2]}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
            }
        });
        return groups;
    }, [filteredItems]);

    const monthsNav = useMemo(() => Object.keys(groupedItems), [groupedItems]);

    const sortedMonths = useMemo(() => [...monthsNav].sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
    }), [monthsNav]);

    const scrollToSection = useCallback((month: string) => {
        const el = document.getElementById(`section-${month}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <div className="bg-[#0a0a0a] text-white">

            {/* Search Bar (Sticky - sits below fixed Header) */}
            <div className="sticky top-[72px] z-[90] bg-black/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
                    <div className="relative max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-red-600/50 focus:bg-white/10 transition-all font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Main Repository with Timeline Scrubber */}
            <div className="relative py-24 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">

                <TimelineScrubber months={sortedMonths} onMonthClick={scrollToSection} />

                <div className="space-y-32">
                    {sortedMonths.map((month) => (
                        <div key={month} id={`section-${month}`} className="scroll-mt-32">

                            {/* Section Header */}
                            <div className="flex items-center gap-6 mb-12 border-l-4 border-red-600 pl-8">
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{month}</h2>
                                <span className="text-gray-700 font-mono text-xs uppercase tracking-[0.3em]">
                                    Documented Incidents: {groupedItems[month].length}
                                </span>
                            </div>

                            {/* Grid - Compact Tiles */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-px bg-white/5 border border-white/5">
                                {groupedItems[month].map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={`card-${item.id}`}
                                        onClick={() => setSelectedVictim(item)}
                                        className="group relative aspect-[3/4] bg-[#0a0a0a] overflow-hidden cursor-pointer border border-white/5"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="absolute inset-0 z-0">
                                            {item.image_url && !failedImages.has(item.image_url) ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover grayscale opacity-70 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                                    loading="lazy"
                                                    onError={() => handleImageError(item.image_url)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-40 transition-opacity">
                                                    <User size={80} strokeWidth={0.5} className="text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90 group-hover:opacity-0 transition-opacity" />

                                        {/* Date badge — top right */}
                                        {item.date_str && (
                                            <div className="absolute top-3 right-3 z-30 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-1 rounded">
                                                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">{formatDate(item.date_str)}</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 z-30 p-8 flex flex-col items-start bg-gradient-to-t from-black to-transparent pt-20">
                                            <motion.span layoutId={`case-id-${item.id}`} className="text-red-600 font-mono text-[9px] uppercase tracking-[0.4em] mb-3">
                                                {(() => { const { identity } = parseVictimDetails(item.details); return identity || 'Undocumented'; })()}
                                            </motion.span>
                                            <motion.h3 layoutId={`title-${item.id}`} className="text-xl md:text-2xl font-black text-white uppercase leading-none tracking-tighter mb-4">
                                                {item.title}
                                            </motion.h3>
                                            <div className="flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                                <div className="flex items-center gap-2 text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                                                    <MapPin size={10} /> <span>{item.location || 'Unknown'}</span>
                                                </div>
                                                <ArrowUpRight size={14} className="text-red-600" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="py-40 text-center">
                        <Shield className="mx-auto text-gray-800 mb-8" size={64} strokeWidth={1} />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No matching records</h3>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Refine your search parameters</p>
                    </div>
                )}

            </div>

            {/* Cinematic Stage (Modal Partition) */}
            <AnimatePresence>
                {selectedVictim && (
                    <motion.div
                        className="fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
                            onClick={() => setSelectedVictim(null)}
                        />
                        <motion.div
                            layoutId={`card-${selectedVictim.id}`}
                            className="relative w-full h-full flex flex-col lg:flex-row overflow-y-auto no-scrollbar scroll-smooth bg-[#070707]"
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Cinematic Visual Stage */}
                            <div className="lg:w-1/2 min-h-[45vh] lg:min-h-screen lg:h-screen lg:sticky lg:top-0 bg-[#000] overflow-hidden relative">
                                <motion.div className="absolute inset-0">
                                    {selectedVictim.image_url && !failedImages.has(selectedVictim.image_url) ? (
                                        <Image
                                            src={selectedVictim.image_url}
                                            alt={selectedVictim.title}
                                            fill
                                            unoptimized
                                            className="object-cover opacity-60 animate-ken-burns"
                                            onError={() => handleImageError(selectedVictim.image_url)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-red-900/10">
                                            <User size={200} strokeWidth={0.2} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/30 to-transparent" />
                                </motion.div>

                                <div className="absolute bottom-6 left-5 right-5 md:bottom-12 md:left-10 md:right-10 z-50">
                                    <motion.span layoutId={`case-id-${selectedVictim.id}`} className="text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 block">
                                        Forensic Case Report
                                    </motion.span>
                                    <motion.h2 layoutId={`title-${selectedVictim.id}`} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.85] tracking-tighter">
                                        {selectedVictim.title}
                                    </motion.h2>
                                </div>

                                <button
                                    onClick={() => setSelectedVictim(null)}
                                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-black/50 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all group"
                                >
                                    <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            {/* Narrative Stage */}
                            <div className="lg:w-1/2 min-h-screen p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center">
                                <div className="max-w-xl mx-auto w-full">
                                    {(() => {
                                        const { so, address, identity, story } = parseVictimDetails(selectedVictim.details);
                                        return (
                                            <div className="space-y-16">
                                                <div className="flex flex-col gap-10 pb-16 border-b border-white/5">
                                                    <InViewAnimation delay={0.2}>
                                                        <div className="flex items-start gap-6">
                                                            <Shield className="text-red-700 shrink-0 mt-1" size={20} strokeWidth={1.5} />
                                                            <div>
                                                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] block mb-2 font-bold">Identity Profile</span>
                                                                <p className="text-white text-3xl font-black uppercase tracking-tighter leading-none">{identity || 'Documented Individual'}</p>
                                                            </div>
                                                        </div>
                                                    </InViewAnimation>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        {so && (
                                                            <InViewAnimation delay={0.4}>
                                                                <div className="flex items-start gap-4 p-6 bg-white/2 border border-white/5 rounded-xl">
                                                                    <User className="text-red-900 shrink-0" size={16} />
                                                                    <div>
                                                                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block mb-2">Lineage</span>
                                                                        <p className="text-gray-300 text-sm font-medium uppercase">{so}</p>
                                                                    </div>
                                                                </div>
                                                            </InViewAnimation>
                                                        )}
                                                        {address && (
                                                            <InViewAnimation delay={0.5}>
                                                                <div className="flex items-start gap-4 p-6 bg-white/2 border border-white/5 rounded-xl">
                                                                    <MapPin className="text-red-900 shrink-0" size={16} />
                                                                    <div>
                                                                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block mb-2">Residence</span>
                                                                        <p className="text-gray-300 text-sm font-medium uppercase">{address}</p>
                                                                    </div>
                                                                </div>
                                                            </InViewAnimation>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="narrative-body prose prose-invert prose-2xl max-w-none">
                                                    {(() => {
                                                        const cleanStory = story || selectedVictim.details;
                                                        const bengaliDateRegex = /([\s\S]+?)\s+([0-9০-৯]{1,2}\s+(?:জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)\s+[0-9০-৯]{4}(?:,\s*[0-9০-৯]{2}:[0-9০-৯]{2})?)\s+([\s\S]+)/;
                                                        const storyMatch = cleanStory.match(bengaliDateRegex);

                                                        if (storyMatch) {
                                                            const headerStr = storyMatch[1].trim();
                                                            const benDate = storyMatch[2].trim();
                                                            const bodyText = storyMatch[3].trim();
                                                            return (
                                                                <div className="flex flex-col gap-12 font-main">
                                                                    <InViewAnimation>
                                                                        <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-[1.1] border-l-2 border-red-600 pl-8">
                                                                            {headerStr.split('\n')[0]}
                                                                        </h3>
                                                                        <div className="flex items-center gap-4 text-red-700 font-mono text-[10px] uppercase tracking-widest pl-8">
                                                                            <Calendar size={12} />
                                                                            <span>{benDate}</span>
                                                                        </div>
                                                                    </InViewAnimation>
                                                                    <InViewAnimation delay={0.3}>
                                                                        <p className="text-gray-300 leading-[1.9] font-light text-[1.25rem] whitespace-pre-wrap">{bodyText}</p>
                                                                    </InViewAnimation>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <InViewAnimation>
                                                                <p className="text-gray-300 leading-[1.9] font-light text-[1.25rem] whitespace-pre-wrap">{cleanStory}</p>
                                                            </InViewAnimation>
                                                        );
                                                    })()}
                                                </div>

                                                <InViewAnimation delay={0.6}>
                                                    <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center gap-12">
                                                        {selectedVictim.qr_code_url && (
                                                            <div className="bg-white p-2 shrink-0">
                                                                <Image src={selectedVictim.qr_code_url} alt="QR" width={100} height={100} className="w-24 h-24" />
                                                            </div>
                                                        )}
                                                        <div className="w-full space-y-4">
                                                            {selectedVictim.news_url && (
                                                                <a href={selectedVictim.news_url} target="_blank" className="flex items-center justify-between w-full px-8 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-red-700 hover:text-white transition-all">
                                                                    Original Source <ArrowUpRight size={18} />
                                                                </a>
                                                            )}
                                                            <span className="text-[8px] font-mono text-gray-800 uppercase tracking-[0.5em] block text-center">Documentary Integrity Verified</span>
                                                        </div>
                                                    </div>
                                                </InViewAnimation>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes ken-burns {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.1) translate(1%, 1%); }
                }
                .animate-ken-burns {
                    animation: ken-burns 30s linear infinite alternate;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
