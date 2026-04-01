import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Users, Eye, Globe2, ScanFace } from 'lucide-react';
import { getDashboardStats } from './actions';
import { OverviewCharts } from '@/components/custom/OverviewCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const statsData = await getDashboardStats();

    return (
        <div className="bg-gray-50/30 min-h-screen pb-10">
            <div className="space-y-8 max-w-[1400px] mx-auto px-1 md:px-0">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Real-time metrics and analytics for both editions.</p>
                    </div>
                </div>

                {/* Overall Primary Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-primary/5 border-primary/20 shadow-sm transition-all hover:bg-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-primary">All Published News</CardTitle>
                            <Newspaper className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{new Intl.NumberFormat().format(statsData?.total_news || 0)}</div>
                            <p className="text-xs text-primary/70 mt-1">Total articles on both editions</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Lifetime Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{new Intl.NumberFormat().format(statsData?.total_views || 0)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all networks</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Admin Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{statsData?.total_users || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">CMS Content Managers</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                            <ScanFace className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{statsData?.total_categories || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Configured global categories</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Segmented Performance Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Bengali Metrics */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="bg-red-50 border-b p-4">
                            <div className="flex items-center gap-2">
                                <Globe2 className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-red-900 text-lg">Bengali Edition</h3>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Articles Published</p>
                                <p className="text-2xl font-bold">{new Intl.NumberFormat().format(statsData?.total_news_bn || 0)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Edition Views</p>
                                <p className="text-2xl font-bold text-red-600">{new Intl.NumberFormat().format(statsData?.total_views_bn || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* English Metrics */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="bg-blue-50 border-b p-4">
                            <div className="flex items-center gap-2">
                                <Globe2 className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900 text-lg">English Edition</h3>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Articles Published</p>
                                <p className="text-2xl font-bold">{new Intl.NumberFormat().format(statsData?.total_news_en || 0)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Edition Views</p>
                                <p className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat().format(statsData?.total_views_en || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Charts */}
                <div className="pt-2">
                    <OverviewCharts
                        categoryStatsBN={statsData?.category_stats_bn || []}
                        categoryStatsEN={statsData?.category_stats_en || []}
                        topNewsBN={statsData?.top_news_bn || []}
                        topNewsEN={statsData?.top_news_en || []}
                        totalViewsBN={statsData?.total_views_bn || 0}
                        totalViewsEN={statsData?.total_views_en || 0}
                    />
                </div>
            </div>
        </div>
    );
}
