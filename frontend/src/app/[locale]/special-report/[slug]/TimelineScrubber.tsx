"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimelineScrubberProps {
    months: string[];
    onMonthClick: (month: string) => void;
}

export default function TimelineScrubber({ months, onMonthClick }: TimelineScrubberProps) {
    const [activeMonth, setActiveMonth] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            const sections = months.map(m => document.getElementById(`section-${m}`));
            const scrollPos = window.scrollY + 300;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPos) {
                    setActiveMonth(months[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [months]);

    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-6">
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-red-900/20 rounded-full" />

            {months.map((month) => {
                const isActive = activeMonth === month;
                return (
                    <button
                        key={month}
                        onClick={() => onMonthClick(month)}
                        className="group flex items-center gap-6 focus:outline-none"
                    >
                        <div className={`
                            w-6 h-6 rounded-full border-2 z-10 transition-all duration-500 flex items-center justify-center
                            ${isActive ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/30' : 'bg-[#0a0a0a] border-red-900/30 hover:border-red-600'}
                        `}>
                            {isActive && <motion.div layoutId="scrubber-active" className="w-2 h-2 bg-white rounded-full" />}
                        </div>

                        <span className={`
                            font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-500 whitespace-nowrap
                            ${isActive ? 'text-white translate-x-0 opacity-100' : 'text-gray-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}
                        `}>
                            {month}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
