import { useRef, useEffect } from 'react';

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  content: string | null;
  isContentTruncated: boolean;
  targetUrl?: string | null;
};

export default function Popover({ isOpen, onClose, imageUrl, title, content, isContentTruncated, targetUrl }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='flex justify-center items-center min-h-full'>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div
          ref={popoverRef}
          className='bg-white flex flex-col gap-6 rounded-2xl w-[76vw] md:w-[35vw] h-[70vh] md:h-[66vh] max-w-3xl overflow-auto'
        >
          { imageUrl && <img 
                                        src= { imageUrl } 
                                        alt='Article image'
                                        className='object-cover object-center'></img> }
          
            <h1 className='text-2xl font-mozilla mx-10'>{ title }</h1>
            <p className='font-mozilla text-lg font-normal mx-10'>
              { content }
              {isContentTruncated && (
                <>
                  {' '}
                  {targetUrl &&
                    <a href={targetUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-400'
                    >
                      continue
                    </a>
                  }
                </>
              )}
            </p>
        </div>
      </div>
    </div>
  );
}