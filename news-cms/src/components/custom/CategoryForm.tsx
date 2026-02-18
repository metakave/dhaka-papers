'use client';

import { useActionState, useTransition, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    name_bn: z.string().optional(),
    description: z.string().optional(),
    priority: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData?: any;
    action: (prevState: any, formData: FormData) => Promise<any>;
}

export function CategoryForm({ initialData, action: serverAction }: CategoryFormProps) {
    const [state, formAction, isPendingState] = useActionState(serverAction, null);
    const [isPendingTransition, startTransition] = useTransition();

    const isPending = isPendingState || isPendingTransition;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: (initialData?.name as string) || '',
            name_bn: (initialData?.name_bn as string) || '',
            description: (initialData?.description as string) || '',
            priority: (initialData?.priority as number) ?? 0,
        },
    });

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Form {...form}>
            <form
                action={formAction}
                onSubmit={(evt) => {
                    evt.preventDefault();
                    form.handleSubmit(() => {
                        const formData = new FormData();
                        const values = form.getValues();
                        Object.entries(values).forEach(([key, value]) => {
                            if (value !== undefined && value !== null) {
                                formData.append(key, String(value));
                            }
                        });
                        startTransition(() => {
                            formAction(formData);
                        });
                    })(evt);
                }}
                className="space-y-8 max-w-xl"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (English)</FormLabel>
                            <FormControl>
                                <Input placeholder="Technology" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name_bn"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (Bangla)</FormLabel>
                            <FormControl>
                                <Input placeholder="প্রযুক্তি" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Category description..."
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
                    name="priority"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Priority (Lower numbers appear first)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={value}
                                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                                    {...field}
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {initialData ? 'Updating...' : 'Create Category'}
                            </>
                        ) : (
                            initialData ? 'Update Category' : 'Create Category'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
