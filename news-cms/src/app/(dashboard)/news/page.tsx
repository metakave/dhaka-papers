import { getNewsAction } from './actions';
import { NewsTable } from '@/components/custom/NewsTable';

export const dynamic = 'force-dynamic';

export default async function NewsPage(props: {
    searchParams: Promise<{ page?: string; sort?: string; search?: string }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams.page) || 1;
    const currentSort = searchParams.sort || 'latest';
    const currentSearch = searchParams.search || '';
    const limit = 10;

    const result = await getNewsAction(currentPage, limit, undefined, currentSearch);

    if ('error' in result) {
        return <div className="p-4 text-red-500">Error: {result.error}</div>;
    }

    // Calculate total pages safely
    const totalPages = Math.ceil((result.total || 0) / limit) || 1;

    return (
        <NewsTable
            data={result.newsList || []}
            currentPage={currentPage}
            currentSort={currentSort}
            totalPages={totalPages}
        />
    );
}
