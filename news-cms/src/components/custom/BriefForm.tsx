'use client';
// v1.0.1 - Brief creation fix


import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, GripVertical, Loader2, Save } from 'lucide-react';
import { createBriefAction, updateBriefAction, BriefItem } from '@/app/(dashboard)/briefs/actions';
import { News } from '@/types';

interface BriefFormProps {
    mode: 'create' | 'edit';
    brief?: News;
    initialItems?: BriefItem[];
}

const emptyItem = (): BriefItem => ({ title: '', description: '' });

export function BriefForm({ mode, brief, initialItems }: BriefFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(brief?.title ?? '');
    const [status, setStatus] = useState(brief?.status ?? 'published');
    const [lang, setLang] = useState(brief?.lang ?? 'bn');
    const [items, setItems] = useState<BriefItem[]>(
        initialItems && initialItems.length > 0 ? initialItems : [emptyItem()]
    );
    const [error, setError] = useState<string | null>(null);

    // ── Item mutations ──────────────────────────────────────────────
    const addItem = () => setItems((prev) => [...prev, emptyItem()]);

    const removeItem = (idx: number) =>
        setItems((prev) => prev.filter((_, i) => i !== idx));

    const updateItem = (idx: number, field: keyof BriefItem, value: string) =>
        setItems((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
        );

    // ── Submit ──────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('একটি শিরোনাম দিন (যেমন: ১২ মে সংক্ষেপ)');
            return;
        }

        const valid = items.filter((i) => i.title.trim());
        if (valid.length === 0) {
            setError('কমপক্ষে একটি সংবাদ আইটেম যোগ করুন');
            return;
        }

        startTransition(async () => {
            const result =
                mode === 'create'
                    ? await createBriefAction(title.trim(), valid, status, lang)
                    : await updateBriefAction(brief!.id, title.trim(), valid, status, lang);

            if (result.success) {
                router.push('/briefs');
                router.refresh();
            } else {
                setError(result.error ?? 'অজানা ত্রুটি');
            }
        });
    };

    // ── UI ──────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Brief label / date title */}
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor="brief-title">
                    সংক্ষেপের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                    id="brief-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: ১২ মে ২০২৬ — সংবাদ সংক্ষেপ"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
            </div>

            {/* Status + Language row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="brief-status">
                        স্ট্যাটাস
                    </label>
                    <select
                        id="brief-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="brief-lang">
                        ভাষা সংস্করণ
                    </label>
                    <select
                        id="brief-lang"
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">
                        সংবাদ আইটেম ({items.length}টি)
                    </h2>
                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        আইটেম যোগ করুন
                    </button>
                </div>

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-3 relative"
                        >
                            {/* Item number badge */}
                            <div className="flex items-center justify-between mb-1">
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                    <GripVertical className="w-4 h-4" />
                                    সংবাদ #{idx + 1}
                                </span>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    শিরোনাম <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateItem(idx, 'title', e.target.value)}
                                    placeholder="সংবাদের শিরোনাম লিখুন..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    বিবরণ
                                </label>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                    placeholder="৩-৪ লাইনে সংক্ষিপ্ত বিবরণ..."
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add another */}
                <button
                    type="button"
                    onClick={addItem}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    আরেকটি সংবাদ যোগ করুন
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {mode === 'create' ? 'প্রকাশ করুন' : 'আপডেট করুন'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/briefs')}
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    বাতিল
                </button>
            </div>
        </form>
    );
}
