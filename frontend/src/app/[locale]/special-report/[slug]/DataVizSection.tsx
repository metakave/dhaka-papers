"use client";

import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Users, Briefcase, Map as MapIcon } from 'lucide-react';

interface Victim {
    id: number;
    title: string;
    details: string;
    date_str: string;
    // ...
}

interface DataVizSectionProps {
    items: any[];
}

const COLORS = ['#DC2626', '#991B1B', '#7F1D1D', '#450A0A', '#111', '#333'];

function parseProfession(details: string) {
    const identityRegex = /Identity:\s*(.+?)(?=\s*[\u0980-\u09FF]|$)/i;
    const match = details.match(identityRegex);
    if (!match) return 'Unknown';
    const id = match[1].toLowerCase();
    if (id.includes('student')) return 'Student';
    if (id.includes('worker') || id.includes('garment')) return 'Laborer';
    if (id.includes('political') || id.includes('activist') || id.includes('league')) return 'Political';
    if (id.includes('business') || id.includes('shop')) return 'Business';
    if (id.includes('driver')) return 'Transport';
    return 'Other';
}

function parseAge(details: string) {
    const ageRegex = /(\d{1,2})\s*years/i;
    const match = details.match(ageRegex);
    return match ? parseInt(match[1]) : null;
}

export default function DataVizSection({ items }: DataVizSectionProps) {
    const stats = useMemo(() => {
        const professions: Record<string, number> = {};
        const ageGroups: Record<string, number> = {
            'Under 18': 0,
            '18-25': 0,
            '26-40': 0,
            '41+': 0,
            'Unknown': 0
        };

        items.forEach(item => {
            const p = parseProfession(item.details);
            professions[p] = (professions[p] || 0) + 1;

            const age = parseAge(item.details);
            if (!age) ageGroups['Unknown']++;
            else if (age < 18) ageGroups['Under 18']++;
            else if (age <= 25) ageGroups['18-25']++;
            else if (age <= 40) ageGroups['26-40']++;
            else ageGroups['41+']++;
        });

        const professionData = Object.entries(professions)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

        return { professionData, ageData };
    }, [items]);

    return (
        <div className="py-24 bg-[#070707] border-t border-b border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="mb-20 text-center max-w-2xl mx-auto">
                    <span className="text-red-600 font-mono tracking-[0.4em] uppercase text-[10px] mb-4 block">Analytical Insights</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">Demographic Impact</h2>
                    <p className="text-gray-500 font-light">
                        Visualizing the patterns identified across {items.length} documented cases.
                        Data is extracted through forensic analysis of primary reporting.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Profession Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 p-8 md:p-12 border border-white/5 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-600/10 rounded-lg">
                                <Briefcase className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Profession Breakdown</h3>
                                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Victim's reported occupation</p>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.professionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.professionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span className="text-gray-400 text-xs font-mono uppercase px-2">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Age Groups */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 p-8 md:p-12 border border-white/5 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-red-600/10 rounded-lg">
                                <Users className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Age Distribution</h3>
                                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Age groups of documented subjects</p>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.ageData}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" fill="#DC2626" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>

                {/* Simplified District Mapping Notice */}
                <div className="mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <MapIcon className="text-red-900" size={48} strokeWidth={1} />
                        <div>
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">Geographic Density</span>
                            <h4 className="text-white font-bold text-lg">Integrated District Map</h4>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm max-w-md text-center md:text-right italic">
                        The interactive map visualization allows you to explore the concentration of incidents
                        across the 64 districts of Bangladesh. Data point density highlights hotspots
                        of extrajudicial actions.
                    </p>
                </div>
            </div>
        </div>
    );
}
