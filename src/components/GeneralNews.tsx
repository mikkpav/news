import type { Article } from '../types/news';
import { useEffect, useState } from 'react';
import NewsService from "../services/NewsService";

type GeneralNewsProps = {
    onArticleClick: (article: Article) => void;
};

export default function GeneralNews( props: GeneralNewsProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
            const articles = await NewsService.fetchTopHeadlines();
            console.log(articles);
                setArticles(articles);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }

        loadNews();
    }, []);

    if (loading) {
        return (
            <div className='center'>Loading...</div>
        );
    }
    if (error) return <div className='center bg-red-300'>Error loading:<br/>{ error }</div>;

    return (
        <ul className='text-sm flex flex-col gap-2 min-h-0'>
            { articles.map((article) => (
                <li key={ article.title } onClick={() => props.onArticleClick(article)}>
                    <div className='flex max-h-16 p-0.5'>
                        {article.image && 
                            <img 
                                src={article.image!} 
                                alt='Article image'
                                className='w-30 object-cover object-center block rounded-sm'
                            ></ img>
                        }
                        <p className='text-left font-medium p-1'>{article.title}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}