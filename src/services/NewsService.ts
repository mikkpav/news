import type { Article, NewsResponse } from '../types/news';
import type { StocksResponse } from '../types/stocks';

const API_KEY_GNEWS = 'd1ba137ee3c83c08205997ea251685b3';
const BASE_URL_GNEWS = 'https://gnews.io/api/v4';
const ENDPOINT_GNEWS_HEADLINES = 'top-headlines';
const ENDPOINT_GNEWS_SEARCH = 'search';
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
        const url = buildUrl(ENDPOINT_GNEWS_HEADLINES, { country });
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

    async fetchHeadlinesByKeywords(keywords: string[]): Promise<Article[]> {
        const query = encodeURIComponent(keywords.join(' AND '));
        console.log('-- keyword to URL: ' + query);
        const url = buildUrl(ENDPOINT_GNEWS_SEARCH, { q: query });
        console.log('URL: ' + url.toString());

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: Unable to fetch keyword news for ${keywords}`)
        }

        const data: NewsResponse = await res.json();
        return data.articles;
    },
};

export default NewsService;