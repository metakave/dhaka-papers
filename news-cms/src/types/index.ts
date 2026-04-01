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
    tags?: string[];
    status: string;
    is_featured: boolean;
    published_at: string;
    created_at: string;
    views_count: number;
    lang: string;
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
    total_news_bn: number;
    total_news_en: number;
    total_categories: number;
    total_users: number;
    total_views: number;
    total_views_bn: number;
    total_views_en: number;
    category_stats: CategoryViewStat[];
    category_stats_bn: CategoryViewStat[];
    category_stats_en: CategoryViewStat[];
    top_news: NewsViewStat[];
    top_news_bn: NewsViewStat[];
    top_news_en: NewsViewStat[];
}

export interface User {
    id: string;
    name: string;
    name_en?: string;
    email: string;
    role: string;
    profile_image?: string;
    hide_profile_image?: boolean;
    created_at: string;
}
