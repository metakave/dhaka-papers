'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CategoryViewStat, NewsViewStat } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

const CHART_COLORS_COMPARISON = ['#dc2626', '#3b82f6']; // Red for BN, Blue for EN

interface OverviewChartsProps {
    categoryStatsBN: CategoryViewStat[];
    categoryStatsEN: CategoryViewStat[];
    topNewsBN: NewsViewStat[];
    topNewsEN: NewsViewStat[];
    totalViewsBN: number;
    totalViewsEN: number;
}

export function OverviewCharts({ categoryStatsBN, categoryStatsEN, topNewsBN, topNewsEN, totalViewsBN, totalViewsEN }: OverviewChartsProps) {
    const comparisonData = [
        { name: 'Bengali Edition', value: totalViewsBN },
        { name: 'English Edition', value: totalViewsEN }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Comparison Doughnut Chart */}
                <Card className="shadow-sm border-border">
                    <CardHeader>
                        <CardTitle className="text-xl">Edition Views Breakdown</CardTitle>
                        <CardDescription>Comparison of total lifetime views</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={comparisonData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {comparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS_COMPARISON[index % CHART_COLORS_COMPARISON.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => new Intl.NumberFormat().format(value || 0) + " Views"} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Categories Tabbed Chart */}
                <Card className="shadow-sm border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Top Categories</CardTitle>
                        <CardDescription>Most viewed categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="bn" className="w-full h-[320px]">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="bn">Bengali Categories</TabsTrigger>
                                <TabsTrigger value="en">English Categories</TabsTrigger>
                            </TabsList>
                            <TabsContent value="bn" className="h-full mt-0">
                                {categoryStatsBN.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="90%">
                                        <PieChart>
                                            <Pie
                                                data={categoryStatsBN}
                                                cx="50%"
                                                cy="45%"
                                                labelLine={false}
                                                outerRadius={85}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryStatsBN.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => new Intl.NumberFormat().format(value || 0) + " Views"} />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
                                )}
                            </TabsContent>
                            <TabsContent value="en" className="h-full mt-0">
                                {categoryStatsEN.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="90%">
                                        <PieChart>
                                            <Pie
                                                data={categoryStatsEN}
                                                cx="50%"
                                                cy="45%"
                                                labelLine={false}
                                                outerRadius={85}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryStatsEN.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => new Intl.NumberFormat().format(value || 0) + " Views"} />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Top Articles by Edition */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                
                {/* Bengali Top News */}
                <Card className="shadow-sm border-border">
                    <CardHeader>
                        <CardTitle className="text-xl">Top Articles (Bengali)</CardTitle>
                        <CardDescription>Most popular local news in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topNewsBN.length > 0 ? (
                                topNewsBN.map((news, index) => (
                                    <div key={news.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                                                #{index + 1}
                                            </div>
                                            <p className="text-sm font-medium leading-tight truncate">{news.title}</p>
                                        </div>
                                        <div className="flex-shrink-0 text-right ml-4">
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                {new Intl.NumberFormat().format(news.views)} views
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* English Top News */}
                <Card className="shadow-sm border-border">
                    <CardHeader>
                        <CardTitle className="text-xl">Top Articles (English)</CardTitle>
                        <CardDescription>Most popular english news in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topNewsEN.length > 0 ? (
                                topNewsEN.map((news, index) => (
                                    <div key={news.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                                                #{index + 1}
                                            </div>
                                            <p className="text-sm font-medium leading-tight truncate">{news.title}</p>
                                        </div>
                                        <div className="flex-shrink-0 text-right ml-4">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {new Intl.NumberFormat().format(news.views)} views
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
