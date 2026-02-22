'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const reportSchema = z.object({
    title: z.string().min(5),
    slug: z.string().min(3),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    status: z.enum(['draft', 'published']),
});

interface ReportItem {
    id?: string;
    title: string;
    date_str: string;
    details: string;
    image_url: string;
    qr_code_url: string;
    news_url: string;
    serial_number: number;
}

interface SpecialReportFormProps {
    initialData?: any;
    initialItems?: ReportItem[];
}

export function SpecialReportForm({ initialData, initialItems = [] }: SpecialReportFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [items, setItems] = useState<ReportItem[]>(initialItems);
    const router = useRouter();

    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            description: initialData?.description || '',
            thumbnail: initialData?.thumbnail || '',
            status: initialData?.status || 'draft',
        },
    });

    const addItem = () => {
        setItems([...items, { title: '', date_str: '', details: '', image_url: '', qr_code_url: '', news_url: '', serial_number: items.length + 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ReportItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const onSubmit = async (values: z.infer<typeof reportSchema>) => {
        setIsPending(true);
        try {
            const token = localStorage.getItem('token');
            const url = initialData
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports/${initialData.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports`;

            const res = await fetch(url, {
                method: initialData ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) throw new Error('Failed to save report');

            let reportId = initialData?.id;
            if (!initialData) {
                const data = await res.json();
                reportId = data.id;
            }

            // Sync items
            const itemRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports/${reportId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(items)
            });

            if (!itemRes.ok) throw new Error('Failed to save items');

            toast.success('Special Report saved successfully');
            router.push('/special-reports');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report Title</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold italic">Report Items (Victims/Entries)</h3>
                        <Button type="button" variant="outline" onClick={addItem}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border space-y-4 relative">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input value={item.title} onChange={(e) => updateItem(index, 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <Input value={item.date_str} onChange={(e) => updateItem(index, 'date_str', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Image URL</label>
                                        <Input value={item.image_url} onChange={(e) => updateItem(index, 'image_url', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Details</label>
                                    <Textarea value={item.details} onChange={(e) => updateItem(index, 'details', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">QR Code URL</label>
                                        <Input value={item.qr_code_url} onChange={(e) => updateItem(index, 'qr_code_url', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">News Link</label>
                                        <Input value={item.news_url} onChange={(e) => updateItem(index, 'news_url', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Special Report
                    </Button>
                </div>
            </form>
        </Form>
    );
}
