import { useState } from 'react';
import './App.css'
import News from './components/News';
import Popover from './components/Popover';
import Stocks from './components/Stocks';
import Weather from './components/Weather';
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
      <header className='header-font py-14 my-10 mx-4 md:mx-0 border-8 border-black'>
        The News
      </header>

      <main className='header-font grid grid-rows-auto grid-cols-auto md:grid-cols-[7fr_3fr] gap-10 md:gap-6 mx-6 md:mx-0'>
          <section className='news-component'>
            <News type={'top'} onArticleClick={openPopoverWithArticle} />
          </section>

          <section className='flex flex-col justify-between gap-10 md:gap-6'>
              <section className='news-component max-h-[340px]'>
                <Stocks />
              </section>

              <section className='news-component max-h-[500px]'>
                <Weather />
              </section>
          </section>

          <section className='news-component'>
            <News type={'keyword'} onArticleClick={openPopoverWithArticle} />
          </section>

      <a href={selectedArticle?.url} target='_blank'>
        {selectedArticle && 
          <Popover 
            isOpen={popoverOpen} 
            onClose={closePopover}
            imageUrl={selectedArticle.image}
            title={selectedArticle.title}
            content={selectedArticle.content}
            isContentTruncated={selectedArticle.isTruncated ?? false}
            targetUrl={selectedArticle.url}
            >
          </Popover>
        }
      </a>
      </main>

      <footer className='font-mozilla py-16 min-h-0'>
        Powered by Mikk Pavelson
      </footer>
    </div>
  )
}

export default App
