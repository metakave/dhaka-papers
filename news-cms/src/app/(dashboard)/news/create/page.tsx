import { getCategoriesAction } from '@/app/(dashboard)/categories/actions';
import { NewsForm } from '@/components/custom/NewsForm';

export const dynamic = 'force-dynamic';

export default async function CreateNewsPage() {
    const categories = await getCategoriesAction();

    if ('error' in categories || !Array.isArray(categories)) {
        return <div className="text-red-500">Error loading categories.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Create New Article</h2>
            <NewsForm categories={categories} />
        </div>
    );
}
