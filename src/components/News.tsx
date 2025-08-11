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
    const [keywords, setKeywords] = useState<string[]>(['world']);
    const didLoad = useRef(false);

    function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setKeywordDraft(e.target.value);
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('- draft: ' + keywordDraft);
        setKeywords((prevList) => [ ...prevList, keywordDraft ]);
        setKeywordDraft('');
    }
    
    useEffect(() => {
        // Avoiding triple loads of useEffect and API calls during dev
        if (didLoad.current) return;
        didLoad.current = true;

        // if (type === 'top') {
        //     loadTopNews()
        // } 
        // The idea was to not automatically load the keyword news - only do it after keyword entered
        // else {
        //     loadNewsWithKeywords();
        // }                

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadTopNews() {
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

    // const loadNewsWithKeywords = useCallback(async () => {
    //     try {
    //         const articles = await NewsService.fetchHeadlinesByKeywords(keywords)
    //         console.log(articles);
    //         setArticles(articles);
    //     } catch (error) {
    //         setError((error as Error).message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [keywords]);

    // useEffect(() => {
    //     loadNewsWithKeywords();
    // }, [loadNewsWithKeywords]);

    // async function loadNewsWithKeywords() {
    //     try {
    //         const articles = await NewsService.fetchHeadlinesByKeywords(keywords)
    //         console.log(articles);
    //         setArticles(articles);
    //     } catch (error) {
    //         setError((error as Error).message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    if (loading) {
        return (
            <div className='center'><img className='w-30' src={Loading}></img></div>
        );
    }
    if (error) return <div className='center bg-red-300'>Error loading:<br/>{ error }</div>;
    console.log('type:', type, 'loading:', loading);
    return (
        <>
            { type == 'keyword' && (
                <form onSubmit={handleFormSubmit} className='flex flex-col p-4'>
                    <label htmlFor='keyword' className='text-sm'>Keywords:</label>
                    <input 
                        id='keyword' 
                        type='text' 
                        onChange={handleKeywordChange}
                        className='border-1 rounded-4 text-xl font-normal' />
                </form>
            )}
            <ul className='text-sm flex flex-col gap-2 min-h-0'>
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