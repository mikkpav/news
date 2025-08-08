
export interface NewsResponse {
    totalArticles: number;
    articles: Article[];
}

export interface Article {
    source: Source;
    title: string;
    description: string | null;
    url: string;
    image: string | null;
    publishedAt: string;
    content: string | null;
    isTruncated: boolean;
}

export interface Source {
    id: string | null;
    name: string;
    url: string;
}