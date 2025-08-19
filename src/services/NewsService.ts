import type { Article, NewsResponse } from '../types/news';
import top_debug from './test data/top_debug_response.json';
import keyword_debug from './test data/keyword_debug_response.json';
import { fetchOrLoadDebug } from './serviceBase';

const API_KEY_GNEWS = import.meta.env.VITE_API_KEY_GNEWS;
const API_KEY_WORLDNEWS = import.meta.env.VITE_API_KEY_WORLDNEWS;
const BASE_URL_GNEWS = 'https://gnews.io/api/v4';
const BASE_URL_WORDLNEWS = 'https://api.worldnewsapi.com';
const ENDPOINT_GNEWS_HEADLINES = 'top-headlines';
const ENDPOINT_WORLDNEWS_TOP = 'top-news';
const ENDPOINT_GNEWS_SEARCH = 'search';
const TRUNCATION_REGEX = /\s*(?:\.\.\.|…)\s*\[\s*(\d+)\s*chars\s*\]\s*$/i;

const DEBUG = false;

function buildUrl(baseUrl: string, endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${baseUrl}/${endpoint}`);

    for (const key in params) {
        url.searchParams.set(key, params[key]);
    }

    return url.toString();
}

function addLinkToTruncatedContent(article: Article): Article {
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
}

const NewsService = {
    async fetchTopHeadlines(country: string = 'us'): Promise<Article[]> {
        const url = buildUrl(BASE_URL_GNEWS, ENDPOINT_GNEWS_HEADLINES, { apikey: API_KEY_GNEWS, country });
        const data: NewsResponse = await fetchOrLoadDebug<NewsResponse>(url, DEBUG, top_debug);
        const linkedArticles = data.articles.map(addLinkToTruncatedContent);
        return linkedArticles;
    },

    async fetchFallbackTopHeadlines(): Promise<Article[]> {
        const url = buildUrl(BASE_URL_WORDLNEWS, ENDPOINT_WORLDNEWS_TOP, { 'api-key': API_KEY_WORLDNEWS, q: 'world' });
        const data: NewsResponse = await fetchOrLoadDebug<NewsResponse>(url, DEBUG);
        console.log(`>>> ${data}`)
        const linkedArticles = data.articles.map(addLinkToTruncatedContent);
        return linkedArticles;
    },

    async fetchHeadlinesByKeyword(keyword: string): Promise<Article[]> {
        const query = encodeURIComponent(keyword);
        const url = buildUrl(BASE_URL_GNEWS, ENDPOINT_GNEWS_SEARCH, { apikey: API_KEY_GNEWS, q: query });
        const data: NewsResponse = await fetchOrLoadDebug<NewsResponse>(url, DEBUG, keyword_debug);
        const linkedArticles = data.articles.map(addLinkToTruncatedContent);
        return linkedArticles;
    },
};

export default NewsService;