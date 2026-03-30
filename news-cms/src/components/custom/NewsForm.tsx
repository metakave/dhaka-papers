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
import { format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { CalendarIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    title_en: z.string().min(5, 'English Title must be at least 5 characters'),
    category_id: z.string().min(1, 'Category is required'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    is_featured: z.boolean(),
    thumbnail: z.any().refine((val) => val && (val instanceof File || typeof val === 'string' && val.length > 0), 'Thumbnail is required'),
    thumbnail_caption: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']),
    published_at: z.date(),
    lang: z.enum(['bn', 'en']),
});

interface NewsFormProps {
    categories: Category[];
    initialData?: News;
    action: (prevState: any, formData: FormData) => Promise<any>;
}

export function NewsForm({ categories, initialData, action: serverAction }: NewsFormProps) {
    const [uploading, setUploading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);
    const router = useRouter();
    const TIMEZONE = 'Asia/Dhaka';

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
            thumbnail_caption: initialData?.thumbnail_caption || '',
            tags: initialData?.tags || [],
            status: (initialData?.status as 'draft' | 'published') || 'draft',
            published_at: initialData?.published_at
                ? toZonedTime(new Date(initialData.published_at), TIMEZONE)
                : toZonedTime(new Date(), TIMEZONE),
            lang: (initialData?.lang as 'bn' | 'en') || 'bn',
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
            formData.append('status', values.status);
            formData.append('lang', values.lang);
            formData.append('thumbnail_caption', values.thumbnail_caption || '');

            if (values.tags && values.tags.length > 0) {
                values.tags.forEach(tag => formData.append('tags', tag));
            }

            // Convert BST from UI back to UTC before sending to server
            const utcDate = fromZonedTime(values.published_at, TIMEZONE);
            formData.append('published_at', utcDate.toISOString());

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="lang"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content Language</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="bn">Bengali (Native Version)</SelectItem>
                                        <SelectItem value="en">English (Subdomain Version)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choose which version this news belongs to.
                                </FormDescription>
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
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Control the visibility of this article.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Title (Main Header)</FormLabel>
                                <FormControl>
                                    <Input placeholder="News Headline" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Headline displayed in the article and lists.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SEO Slug Source (English)</FormLabel>
                                <FormControl>
                                    <Input placeholder="News Headline in English" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Used for generating the URL slug: dhakapapers.com/news/slug-here
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Input 
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (tagInput.trim()) {
                                                        field.onChange([...(field.value || []), tagInput.trim()]);
                                                        setTagInput('');
                                                    }
                                                }
                                            }}
                                            placeholder="Add a tag and press Enter..." 
                                        />
                                        <Button 
                                            type="button" 
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (tagInput.trim()) {
                                                    field.onChange([...(field.value || []), tagInput.trim()]);
                                                    setTagInput('');
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {field.value && field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value.map((tag: string, index: number) => (
                                                <span key={index} className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                                                    {tag}
                                                    <button 
                                                        type="button" 
                                                        className="text-gray-500 hover:text-red-500 font-bold ml-1 focus:outline-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            field.onChange((field.value || []).filter((_: any, i: number) => i !== index));
                                                        }}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>Press Enter or click Add to add a tag.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="published_at"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Publish Date & Time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP p")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                        <div className="p-3 border-t">
                                            <Input
                                                type="time"
                                                onChange={(e) => {
                                                    const date = field.value || new Date();
                                                    const [hours, minutes] = e.target.value.split(':');
                                                    if (hours && minutes) {
                                                        date.setHours(parseInt(hours), parseInt(minutes));
                                                        field.onChange(date);
                                                    }
                                                }}
                                                value={field.value ? format(field.value, 'HH:mm') : ''}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Set future date for scheduled publishing
                                </FormDescription>
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
                    name="thumbnail_caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image Caption (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Caption for the thumbnail image..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Displays below the main article image
                            </FormDescription>
                            <FormMessage />
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
