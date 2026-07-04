'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Icon from '@/components/ui/Icon';
import { tl } from '@/lib/i18n';

export default function ShopPage() {
  const { lang, resolve, cms } = useApp();
  const s = cms.shop;
  const [category, setCategory] = useState('all');

  const products = category === 'all'
    ? s.products
    : s.products.filter(p => p.category === category);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-6 gradient-text">{resolve(s.title)}</h1>

      {/* Category filter */}
      {s.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              category === 'all' ? 'bg-primary text-white' : 'glass-card text-text-secondary hover:text-text-primary'
            }`}>
            {tl('all', lang)}
          </button>
          {s.categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                category === cat ? 'bg-primary text-white' : 'glass-card text-text-secondary hover:text-text-primary'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="glass-card p-12 text-center text-text-muted">
          {lang === 'fa' ? 'محصولی موجود نیست' : 'No products available'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className={`glass-card overflow-hidden ${p.featured ? 'border-accent-amber/30' : ''}`}>
              {p.image && (
                <div className="relative h-40 bg-bg-secondary">
                  <img src={p.image} alt={resolve(p.title)} className="w-full h-full object-cover" />
                  {p.soldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-black text-lg">{tl('soldOut', lang)}</span>
                    </div>
                  )}
                  {p.discount > 0 && !p.soldOut && (
                    <span className="absolute top-2 end-2 bg-accent-rose text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      −{p.discount}% {tl('off', lang)}
                    </span>
                  )}
                  {p.featured && (
                    <span className="absolute top-2 start-2 text-accent-amber text-xs font-bold">⭐ FEATURED</span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">{resolve(p.title)}</h3>
                <p className="text-xs text-text-secondary mb-3 line-clamp-2">{resolve(p.description)}</p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-black text-primary">
                    ${p.discount > 0 ? (p.priceUSD * (1 - p.discount / 100)).toFixed(0) : p.priceUSD}
                    {p.discount > 0 && (
                      <span className="text-xs text-text-muted line-through ms-1">${p.priceUSD}</span>
                    )}
                  </div>
                  {p.soldOut ? (
                    <span className="text-xs text-text-muted">{tl('soldOut', lang)}</span>
                  ) : (
                    <a href={p.buyUrl || `mailto:${cms.identity.email}?subject=Buy: ${resolve(p.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:brightness-110 transition">
                      {tl('buy', lang)}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
