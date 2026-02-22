'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { DashboardStats } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats | null> {
    try {
        const token = await getAuthToken();
        const response = await api.get('/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error.message);
        return null;
    }
}
