import { useState } from 'react';
import './App.css'
import GeneralNews from './components/GeneralNews';
import Popover from './components/Popover';
import type { Article } from './types/news';

function App() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  function openPopoverWithArticle(article: Article) {
    setSelectedArticle(article);
    setPopoverOpen(true);
  }

  function closePopover() {
    setPopoverOpen(false);
    setSelectedArticle(null);
  }

  return (
    <div className='h-screen flex flex-col'>
      <header className='header-font py-10'>
        The News
      </header>

      <main className='flex-1 header-font grid grid-cols-2 grid-rows-2 min-h-0'>
        <section className='news-component'>
          <GeneralNews onArticleClick={openPopoverWithArticle}/>
        </section>

        <div className='news-component'>

        </div>

        <div className='news-component'>
          <p>Stock Tickers</p>
        </div>

        <div className='news-component'>
          <p>Weather</p>
        </div>

      <a href={selectedArticle?.url} target='_blank'>
        {selectedArticle && 
          <Popover 
            isOpen={popoverOpen} 
            onClose={closePopover}
            imageUrl={selectedArticle.image}
            title={selectedArticle.title}
            content={selectedArticle.content}
            isContentTruncated={selectedArticle.isTruncated}
            targetUrl={selectedArticle.url}
            >
          </Popover>
        }
      </a>
      </main>

      <footer className='font-mozilla py-4 min-h-0'>
        Powered by Mikk Pavelson
      </footer>
    </div>
  )
}

export default App
