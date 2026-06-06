import { getBriefBySlug } from '../../actions';
import { BriefForm } from '@/components/custom/BriefForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditBriefPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { brief, items } = await getBriefBySlug(slug);

    if (!brief) return notFound();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">সংবাদ সংক্ষেপ সম্পাদনা</h1>
            <BriefForm mode="edit" brief={brief} initialItems={items} />
        </div>
    );
}
