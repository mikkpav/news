import type { Article } from '../types/news';
import { useEffect, useRef, useState, useCallback } from 'react';
import NewsService from "../services/NewsService";
import Loading from '../assets/loading.gif';

export type NewsType = 'top' | 'keyword';

type BaseNewsProps = {
    onArticleClick: (article: Article) => void;
}

type TopHeadlineProps = BaseNewsProps & {
    type: Exclude<NewsType, 'keyword'>;
    id?: number;
}

type KeywordHeadlineProps = BaseNewsProps & {
    type: 'keyword';
    id: number;
}

type NewsProps = TopHeadlineProps | KeywordHeadlineProps;

export default function News({ type, id, onArticleClick }: NewsProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [keywordDraft, setKeywordDraft] = useState<string>('');
    const storageKeyword = `keyword${id}`;
    const [keyword, setKeyword] = useState<string>(() => {
        const storedKeyword = localStorage.getItem(storageKeyword);
        return storedKeyword ?? 'world';
    });
    const didLoad = useRef(false);

    function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setKeywordDraft(e.target.value);
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setKeyword(keywordDraft);
        localStorage.setItem(storageKeyword, keywordDraft)
        setKeywordDraft('');
    }
    
    useEffect(() => {
        // Avoiding triple loads of useEffect and API calls during dev
        if (didLoad.current) return;
        didLoad.current = true;

        if (type === 'top') {
            loadTopNews();
        } else {
            // A workaround for the free API quotas
            setTimeout(() => {
                loadNewsWithKeyword();
            }, id === 1 ? 1200 : 2400);
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

    if (loading) {
        return (
            <div className='center'><img className='w-30' src={Loading}></img></div>
        );
    }

    return (
        <>
        <h1 className='section-title-font'>{ type == 'top' && 'Top Headlines' }</h1>
            { type == 'keyword' && (
                <form onSubmit={handleFormSubmit} className='flex flex-col p-4 gap-2'>
                    <label htmlFor='keyword' className='text-xl'>Keyword:</label>
                    <div className='flex gap-5 items-center justify-between'>
                        <input 
                            id='keyword' 
                            type='text' 
                            onChange={handleKeywordChange}
                            className='flex w-[50%] md:w-[70%] flex-[7] border-2 px-2 rounded-4 text-xl font-normal' />
                        <p className='truncate flex-[3] text-[20px] bg-blue-100 rounded-lg mx-2 px-2 p-1'>{keyword}</p>
                    </div>
                </form>
            )}
            { error
                ? <div className='error'>Error loading:<br/>{ error }</div>
                : 
                <ul className='text-sm flex flex-col p-2 gap-4 overflow-y-auto scroll-hide'>
                    { articles.map((article) => (
                        <li 
                            key={ article.title } 
                            className='cursor-pointer'
                            onClick={() => onArticleClick(article)}>
                                <div className='flex min-h-0 p-0.5'>
                                    {article.image && 
                                        <img 
                                            src={article.image!} 
                                            alt='Article image'
                                            className='w-30 object-cover object-center block rounded-sm'
                                        ></ img>
                                    }
                                    <p className='text-left line-clamp-2 font-medium p-1 pl-2'>{article.title}</p>
                                </div>
                        </li>
                    ))}
                </ul>
            }
        </>
    )
}