'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateNewsPath(): Promise<void> {
    revalidatePath('/news');
}
