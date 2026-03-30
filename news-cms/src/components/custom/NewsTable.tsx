'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus, Loader2, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { News } from '@/types';
import { deleteNewsAction } from '@/app/(dashboard)/news/actions';
import { toast } from 'sonner';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface NewsTableProps {
    data: News[];
    totalPages: number;
    currentPage: number;
    currentSort: string;
    currentLang: string;
}

export function NewsTable({ data, totalPages, currentPage, currentSort, currentLang }: NewsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onConfirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const result = await deleteNewsAction(deleteId);
        setIsDeleting(false);
        setDeleteId(null);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('News deleted successfully');
            router.refresh();
        }
    };

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        params.set('page', '1'); // Reset to page 1 on sort change
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLangChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete('lang');
        } else {
            params.set('lang', value);
        }
        params.set('page', '1'); // Reset to page 1 on filter change
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">News Articles</h2>
                    <Link href="/news/create">
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create News
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="relative w-full sm:w-[300px]">
                        <input
                            type="text"
                            placeholder="Search news..."
                            defaultValue={searchParams.get('search')?.toString()}
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (e.target.value) {
                                    params.set('search', e.target.value);
                                } else {
                                    params.delete('search');
                                }
                                params.set('page', '1'); // Reset to page 1
                                router.replace(`${pathname}?${params.toString()}`);
                            }}
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>

                    <Select value={currentSort} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
                            <ListFilter className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="views_desc">Views (High to Low)</SelectItem>
                            <SelectItem value="views_asc">Views (Low to High)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={currentLang} onValueChange={handleLangChange}>
                        <SelectTrigger className="w-full sm:w-[150px] bg-white">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Languages</SelectItem>
                            <SelectItem value="bn">Bengali (BN)</SelectItem>
                            <SelectItem value="en">English (EN)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No news articles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate" title={article.title}>
                                        {article.title}
                                        {article.is_featured && (
                                            <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{article.category_name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={article.lang === 'en' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                                            {article.lang === 'en' ? 'English' : 'Bengali'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{article.views_count}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/news/edit/${article.slug}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => setDeleteId(article.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Basic Pagination Controls */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({data.length} items)
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={() => router.push(`${pathname}?page=${currentPage - 1}&sort=${currentSort}${currentLang !== 'all' ? `&lang=${currentLang}` : ''}`)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() => router.push(`${pathname}?page=${currentPage + 1}&sort=${currentSort}${currentLang !== 'all' ? `&lang=${currentLang}` : ''}`)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent aria-describedby="delete-news-description">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription id="delete-news-description">
                            This action cannot be undone. This will permanently delete the news article.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
