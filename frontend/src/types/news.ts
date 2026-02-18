export interface News {
    id: string;
    author_id: string;
    category_id: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    slug: string;
    status: string;
    is_featured: boolean;
    views_count: number;
    published_at: string;
    created_at: string;
    updated_at: string;
    author_name?: string;
    category_name?: string;
    category_name_bn?: string;
    category_slug?: string;
}

export interface NewsListResponse {
    newsList: News[];
}
