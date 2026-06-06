import Link from 'next/link';
import { getBriefsAction } from './actions';
import { deleteBriefAction } from './actions';
import { BriefListClient } from '@/components/custom/BriefListClient';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
    const { briefs, error } = await getBriefsAction();

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">সংবাদ সংক্ষেপ</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        The latest published brief is shown on the homepage. Most recent is active.
                    </p>
                </div>
                <Link
                    href="/briefs/create"
                    className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                >
                    + নতুন সংক্ষেপ
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <BriefListClient briefs={briefs} />
        </div>
    );
}
