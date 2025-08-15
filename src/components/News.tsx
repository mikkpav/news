import type { Article } from '../types/news';
import { useEffect, useRef, useState, useCallback } from 'react';
import NewsService from "../services/NewsService";
import Loading from '../assets/loading.gif';

export type NewsType = 'top' | 'keyword';

type NewsProps = { 
    type: NewsType;
    onArticleClick: (article: Article) => void;
};

export default function News({ type, onArticleClick }: NewsProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [keywordDraft, setKeywordDraft] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('world');
    const didLoad = useRef(false);

    function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setKeywordDraft(e.target.value);
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setKeyword(keywordDraft);
        setKeywordDraft('');
    }
    
    useEffect(() => {
        // Avoiding triple loads of useEffect and API calls during dev
        if (didLoad.current) return;
        didLoad.current = true;

        if (type === 'top') {
            loadTopNews()
        } else {
            // The idea was to not automatically load the keyword news - only do it after keyword entered
            loadNewsWithKeyword();
        }                

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadTopNews() {
        try {
            const articles = await NewsService.fetchTopHeadlines();
            setArticles(articles);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const loadNewsWithKeyword = useCallback(async () => {
        try {
            const articles = await NewsService.fetchHeadlinesByKeyword(keyword)
            setArticles(articles);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [keyword]);

    useEffect(() => {
        if (type === 'keyword') {
            loadNewsWithKeyword();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadNewsWithKeyword]);

    if (loading) {
        return (
            <div className='center'><img className='w-30' src={Loading}></img></div>
        );
    }
    if (error) return <div className='error'>Error loading:<br/>{ error }</div>;

    return (
        <>
        <h1 className='section-title-font'>{ type == 'top' ? 'Top Headlines' : 'Search Headlines' }</h1>
            { type == 'keyword' && (
                <form onSubmit={handleFormSubmit} className='flex flex-col p-4'>
                    <label htmlFor='keyword' className='text-xl'>Keywords:</label>
                    <div className='flex gap-5 items-center justify-between'>
                        <input 
                            id='keyword' 
                            type='text' 
                            onChange={handleKeywordChange}
                            className='flex-none w-[70%] border-1 rounded-4 text-xl font-normal' />
                        <p className='truncate inline-block min-w-[8ch] text-[20px] bg-blue-100 rounded-lg mx-2 px-2 p-1'>{keyword}</p>
                    </div>
                </form>
            )}
            <ul className='text-sm flex flex-col p-2 gap-2 min-h-0 overflow-y-auto scroll-hide'>
                { articles.map((article) => (
                    <li 
                        key={ article.title } 
                        className='cursor-pointer'
                        onClick={() => onArticleClick(article)}>
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
        </>
    )
}