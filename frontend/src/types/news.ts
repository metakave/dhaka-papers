export interface News {
    id: string;
    author_id: string;
    category_id: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    thumbnail_caption?: string;
    slug: string;
    status: string;
    is_featured: boolean;
    is_brief?: boolean;
    views_count: number;
    published_at: string;
    created_at: string;
    updated_at: string;
    author_name?: string;
    author_name_en?: string;
    author_profile_image?: string;
    author_hide_profile_image?: boolean;
    category_name?: string;
    category_name_bn?: string;
    category_slug?: string;
    tags?: string[];
    title_en?: string;
}

export interface NewsListResponse {
    newsList: News[];
}
