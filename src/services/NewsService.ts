import type { Article, NewsResponse } from '../types/news';

// const API_KEY_NEWSAPI = '8894dd161fd542fdad47cf292d63e32c';
// const BASE_URL_NEWSAPI = 'https://newsapi.org/v2';
// const ENDPOINT_KEYWORD_NEWSAPI= 'everything';
const API_KEY_GNEWS = 'd1ba137ee3c83c08205997ea251685b3';
const BASE_URL_GNEWS = 'https://gnews.io/api/v4';
const ENDPOINT_HEADLINES = 'top-headlines';
const ENDPOINT_SEARCH_GNEWS = 'q';
const TRUNCATION_REGEX = /\s*(?:\.\.\.|…)\s*\[\s*(\d+)\s*chars\s*\]\s*$/i;

function buildUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${BASE_URL_GNEWS}/${endpoint}`);
    url.searchParams.set('apikey', API_KEY_GNEWS);
    for (const key in params) {
        url.searchParams.set(key, params[key]);
    }
    return url.toString();
}

const NewsService = {
    async fetchTopHeadlines(country: string = 'us'): Promise<Article[]> {
        const url = buildUrl(ENDPOINT_HEADLINES, { country });
        console.log(`URL: ${url.toString()}`)
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: Unable to fetch top headlines for ${ country }`);
        } 

        const data: NewsResponse = await res.json();
        const cleanedArticles = data.articles.map(article => {
            const truncatedMatch = article.content?.match(TRUNCATION_REGEX);

            if (truncatedMatch) {
                return {
                ...article,
                content: article.content?.replace(TRUNCATION_REGEX, '...') ?? null,
                isTruncated: true,
                };
            }

            return {
                ...article,
                isTruncated: false,
            };
        });

        return cleanedArticles;
    },

    async fetchHeadlinesByKeyword(keyword: string): Promise<Article[]> {
        const url = buildUrl(ENDPOINT_SEARCH_GNEWS, { keyword });

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: Unable to fetch keyword news for ${keyword}`)
        }

        const data: NewsResponse = await res.json();
        return data.articles;
    },
};

export default NewsService;