import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, RefreshCw, ExternalLink } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { fetchNewsByCareer, formatNewsDate } from '../../services/newsService';
import type { NewsItem } from '../../data/news';

interface WowPanelProps {
  onClose: () => void;
}

type LoadState = 'loading' | 'success' | 'error' | 'empty';

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border bg-surface group relative ${
        item.isBreaking ? 'border-accent/30 bg-accent/5' : 'border-border hover:border-primary/30'
      } transition-all duration-200`}
    >
      {item.isBreaking && (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-accent mb-2">
          🔴 Breaking
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0 mt-0.5">{item.imageEmoji}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm leading-snug mb-1.5">{item.title}</h4>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-3 line-clamp-3">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{item.source}</span>
              <span>·</span>
              <span>{formatNewsDate(item.publishedAt)}</span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Read <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WowPanel({ onClose }: WowPanelProps) {
  const { selectedCareer } = useCareer();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  const loadNews = async () => {
    setLoadState('loading');
    try {
      const data = await fetchNewsByCareer(selectedCareer?.id);
      if (data.length === 0) setLoadState('empty');
      else {
        setNews(data);
        setLoadState('success');
      }
    } catch {
      setLoadState('error');
    }
  };

  useEffect(() => { loadNews(); }, [selectedCareer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const domainLabel = selectedCareer?.title || 'Technology';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">WOW</h2>
              <p className="text-xs text-muted-foreground">Latest in {domainLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadNews}
              aria-label="Refresh news"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close WOW panel"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {loadState === 'loading' && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-surface animate-pulse flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-surface-2 rounded-md w-3/4" />
                    <div className="h-3 bg-surface-2 rounded-md w-full" />
                    <div className="h-3 bg-surface-2 rounded-md w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {loadState === 'empty' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="text-5xl">📭</div>
              <div>
                <p className="text-foreground font-medium mb-1">No updates available</p>
                <p className="text-muted-foreground text-sm">No latest updates for this domain right now.</p>
              </div>
              <button onClick={loadNews} className="text-primary text-sm font-medium hover:underline">Try again</button>
            </div>
          )}

          {loadState === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="text-5xl">⚠️</div>
              <div>
                <p className="text-foreground font-medium mb-1">Unable to load updates</p>
                <p className="text-muted-foreground text-sm">Something went wrong while fetching news.</p>
              </div>
              <button
                onClick={loadNews}
                className="inline-flex items-center gap-2 px-5 py-2 border border-border rounded-xl text-sm font-medium hover:bg-surface-2 transition-all"
              >
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}

          {loadState === 'success' && news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <NewsCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-border bg-surface/60 flex-shrink-0">
          <p className="text-[11px] text-muted-foreground text-center">
            {/* TODO: Connect to backend API for live news */}
            Content curated for {domainLabel} developers
          </p>
        </div>
      </motion.div>
    </>
  );
}
