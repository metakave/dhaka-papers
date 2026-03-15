export interface News {
    id: string;
    title: string;
    title_en?: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail: string;
    thumbnail_caption?: string;
    category_id: string;
    category_name?: string;
    author_name?: string;
    status: string;
    is_featured: boolean;
    published_at: string;
    created_at: string;
    views_count: number;
}

export interface Category {
    id: string;
    name: string;
    name_bn?: string;
    slug: string;
    description?: string;
    priority: number;
}

export interface PaginatedResponse<T> {
    newsList: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CategoryViewStat {
    name: string;
    value: number;
}

export interface NewsViewStat {
    id: string;
    title: string;
    views: number;
}

export interface DashboardStats {
    total_news: number;
    total_categories: number;
    total_users: number;
    total_views: number;
    category_stats: CategoryViewStat[];
    top_news: NewsViewStat[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}
