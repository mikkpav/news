
export interface NewsResponse {
    articles: Article[];
}

export interface Article {
    source: Source;
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    urlToImage?: string | null;
    publishedAt: string;
    content: string | null;
    isTruncated?: boolean;
}

export interface Source {
    id: string | null;
    name: string;
    url?: string | null;
}