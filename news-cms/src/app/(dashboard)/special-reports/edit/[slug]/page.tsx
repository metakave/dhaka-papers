import { SpecialReportForm } from '@/components/custom/SpecialReportForm';

async function getReport(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports/${slug}`, {
        cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function EditSpecialReportPage({ params }: { params: { slug: string } }) {
    const report = await getReport(params.slug);

    if (!report) {
        return (
            <div className="flex-1 p-8 text-center text-red-500">
                Report not found
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Special Report</h2>
            </div>
            <SpecialReportForm initialData={report} initialItems={report.items} />
        </div>
    );
}
