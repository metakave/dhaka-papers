'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '@/components/custom/TipTapEditor';
import { Category, News } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    title_en: z.string().min(5, 'English Title must be at least 5 characters'),
    category_id: z.string().min(1, 'Category is required'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    is_featured: z.boolean(),
    thumbnail: z.any().refine((val) => val && (val instanceof File || typeof val === 'string' && val.length > 0), 'Thumbnail is required'),
});

interface NewsFormProps {
    categories: Category[];
    initialData?: News;
    action: (prevState: any, formData: FormData) => Promise<any>;
}

export function NewsForm({ categories, initialData, action: serverAction }: NewsFormProps) {
    const [uploading, setUploading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            title_en: initialData?.title_en || '',
            category_id: initialData?.category_id || '',
            excerpt: initialData?.excerpt || '',
            content: initialData?.content || '',
            is_featured: initialData ? initialData.is_featured : false,
            thumbnail: initialData?.thumbnail || '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Limit to 2MB
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_SIZE) {
            toast.error('Image is too large. Please select an image smaller than 2MB.');
            e.target.value = ''; // Clear selection
            return;
        }

        // Instant local preview
        const localUrl = URL.createObjectURL(file);
        setThumbnailPreview(localUrl);

        // Store the file object in the form state
        form.setValue('thumbnail', file as any);

        if (file.size > 1024 * 1024) {
            toast.info('Note: Images under 1MB are recommended for faster loading.');
        } else {
            toast.success('Image selected');
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsPending(true);
            const formData = new FormData();

            // Append all fields to FormData
            formData.append('title', values.title);
            formData.append('title_en', values.title_en);
            formData.append('category_id', values.category_id);
            formData.append('excerpt', values.excerpt);
            formData.append('content', values.content);
            formData.append('is_featured', String(values.is_featured));

            // Thumbnail can be a File (new) or string (existing)
            if ((values.thumbnail as any) instanceof File) {
                formData.append('thumbnail', values.thumbnail);
            } else if (typeof values.thumbnail === 'string') {
                formData.append('thumbnail', values.thumbnail);
            }

            const result = await serverAction(null, formData);

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(initialData ? 'News updated successfully' : 'News published successfully');
                // Navigate to news list after short delay
                setTimeout(() => {
                    router.push('/news');
                }, 500);
            }
        } catch (error) {
            toast.error('Submission failed. Please check your network.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            {/* preventDefault is handled by handleSubmit */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title (Bangla)</FormLabel>
                            <FormControl>
                                <Input placeholder="News Headline in Bangla" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title (English)</FormLabel>
                            <FormDescription>Used for generating SEO-friendly URL slug</FormDescription>
                            <FormControl>
                                <Input placeholder="News Headline in English" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                                <div className="space-y-0.5">
                                    <FormLabel>Featured News</FormLabel>
                                    <FormDescription>
                                        Show on the homepage slider
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={uploading || isPending}
                                    />
                                    {uploading && (
                                        <div className="flex items-center text-sm text-primary animate-pulse">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading to R2...
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <input type="hidden" {...field} />
                            <FormDescription className="text-xs italic text-gray-500">
                                Recommended: Less than 1MB. Max allowed: 2MB. Best ratio: 16:9
                            </FormDescription>
                            <FormMessage />
                            {thumbnailPreview && (
                                <div className="mt-2 relative h-40 w-full max-w-xs border rounded overflow-hidden bg-muted">
                                    <Image
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized // Allow local blob preview
                                    />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt (Short Description)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief summary of the news..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <TipTapEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || uploading}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {initialData ? 'Updating...' : 'Publishing...'}
                            </>
                        ) : uploading ? (
                            'Waiting for Image...'
                        ) : (
                            initialData ? 'Update News' : 'Publish News'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
