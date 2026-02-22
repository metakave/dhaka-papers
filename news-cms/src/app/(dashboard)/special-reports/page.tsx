import { SpecialReportTable } from '@/components/custom/SpecialReportTable';

async function getReports() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reports || [];
}

export default async function SpecialReportsPage() {
    const reports = await getReports();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <SpecialReportTable reports={reports} />
        </div>
    );
}
