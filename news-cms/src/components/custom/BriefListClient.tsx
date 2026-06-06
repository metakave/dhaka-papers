'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { deleteBriefAction } from '@/app/(dashboard)/briefs/actions';
import { News } from '@/types';

interface BriefListClientProps {
    briefs: News[];
}

export function BriefListClient({ briefs }: BriefListClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string, title: string) => {
        if (!confirm(`"${title}" মুছে ফেলতে চান?`)) return;
        setDeletingId(id);
        startTransition(async () => {
            await deleteBriefAction(id);
            setDeletingId(null);
            router.refresh();
        });
    };

    if (briefs.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <p className="text-lg font-medium">কোনো সংবাদ সংক্ষেপ নেই</p>
                <p className="text-sm mt-1">উপরের বোতামে ক্লিক করে নতুন সংক্ষেপ তৈরি করুন।</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Legend */}
            <p className="text-xs text-gray-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> সবচেয়ে নতুন Published ব্রিফটি হোমপেজে দেখাবে।
            </p>

            {briefs.map((brief, idx) => {
                const isActive = idx === 0 && brief.status === 'published';
                return (
                    <div
                        key={brief.id}
                        className={`flex items-start justify-between gap-4 border rounded-xl px-4 py-3 bg-white shadow-sm transition-all ${
                            isActive ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {isActive && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                )}
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                    brief.status === 'published'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                }`}>
                                    {brief.status === 'published' ? (
                                        <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                        <Clock className="w-3 h-3" />
                                    )}
                                    {brief.status}
                                </span>
                                {/* Language badge */}
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                    brief.lang === 'en'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-orange-50 text-orange-700 border-orange-200'
                                }`}>
                                    {brief.lang === 'en' ? 'EN' : 'BN'}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-800 truncate">{brief.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(brief.published_at).toLocaleString('bn-BD')}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link
                                href={`/briefs/edit/${brief.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-700 border border-gray-200 hover:border-blue-300 px-2.5 py-1.5 rounded-md transition-colors"
                            >
                                <Pencil className="w-3 h-3" />
                                সম্পাদনা
                            </Link>
                            <button
                                type="button"
                                disabled={deletingId === brief.id || isPending}
                                onClick={() => handleDelete(brief.id, brief.title)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-300 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50"
                            >
                                {deletingId === brief.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Trash2 className="w-3 h-3" />
                                )}
                                মুছুন
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
