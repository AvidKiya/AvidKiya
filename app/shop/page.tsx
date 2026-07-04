'use client';

import { useState } from 'react';
import { useApp, useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

export default function ShopPage() {
  const { language } = useApp();
  const { cms, t } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  if (!cms.shop.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="shopping-bag" size={64} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
          <h1 className="text-2xl font-bold mb-2">
            {language === 'fa' ? 'فروشگاه به زودی' : 'Shop Coming Soon'}
          </h1>
          <p className="text-[var(--text-muted)]">
            {language === 'fa' ? 'فروشگاه در حال آماده‌سازی است' : 'The shop is being prepared'}
          </p>
        </div>
      </div>
    );
  }
  
  const filteredProducts = selectedCategory
    ? cms.shop.products.filter(p => p.category === selectedCategory)
    : cms.shop.products;
  
  const featuredProducts = filteredProducts.filter(p => p.featured);
  const regularProducts = filteredProducts.filter(p => !p.featured);
  
  const formatPrice = (product: typeof cms.shop.products[0]) => {
    if (product.priceUSD) return `$${product.priceUSD}`;
    if (product.priceEUR) return `€${product.priceEUR}`;
    if (product.priceTMN) return `${product.priceTMN.toLocaleString()} تومان`;
    if (product.priceIRR) return `${product.priceIRR.toLocaleString()} ریال`;
    if (product.priceUSDT) return `${product.priceUSDT} USDT`;
    return language === 'fa' ? 'رایگان' : 'Free';
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black gradient-text mb-4">
            {t(cms.shop.title)}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {language === 'fa' ? 'محصولات دیجیتال' : 'Digital Products'}
          </p>
        </div>
        
        {/* Category Filter */}
        {cms.shop.categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedCategory === null
                  ? 'gradient-bg text-white'
                  : 'glass-card hover:border-[var(--border-active)]'
              }`}
            >
              {language === 'fa' ? 'همه' : 'All'}
            </button>
            {cms.shop.categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === category
                    ? 'gradient-bg text-white'
                    : 'glass-card hover:border-[var(--border-active)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Products */}
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} featured />
          ))}
          
          {/* Regular Products */}
          {regularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Icon name="shopping-bag" size={48} className="mx-auto mb-4 opacity-50" />
            <p>{language === 'fa' ? 'محصولی یافت نشد' : 'No products found'}</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: {
    id: string;
    title: { fa: string; en: string };
    description: { fa: string; en: string };
    image?: string;
    priceUSD?: number;
    priceEUR?: number;
    priceIRR?: number;
    priceTMN?: number;
    priceUSDT?: number;
    discount?: number;
    category: string;
    tags: string[];
    featured: boolean;
    soldOut: boolean;
    buyUrl?: string;
  };
  featured?: boolean;
}

function ProductCard({ product, featured }: ProductCardProps) {
  const { language } = useApp();
  const { t } = useCms();
  
  const formatPrice = () => {
    if (product.priceUSD) return `$${product.priceUSD}`;
    if (product.priceEUR) return `€${product.priceEUR}`;
    if (product.priceTMN) return `${product.priceTMN.toLocaleString()} ${language === 'fa' ? 'تومان' : 'TMN'}`;
    if (product.priceIRR) return `${product.priceIRR.toLocaleString()} ${language === 'fa' ? 'ریال' : 'IRR'}`;
    if (product.priceUSDT) return `${product.priceUSDT} USDT`;
    return language === 'fa' ? 'رایگان' : 'Free';
  };
  
  const originalPrice = () => {
    if (!product.discount) return null;
    const price = product.priceUSD || product.priceEUR || product.priceTMN || 0;
    return (price / (1 - product.discount / 100)).toFixed(0);
  };
  
  const handleBuy = () => {
    if (product.buyUrl) {
      window.open(product.buyUrl, '_blank');
    } else {
      // Fallback to email
      window.location.href = `mailto:hello@avidkia.dev?subject=Purchase: ${t(product.title)}`;
    }
  };
  
  return (
    <div className={`glass-card-strong overflow-hidden group ${featured ? 'ring-2 ring-[var(--accent-amber)]' : ''}`}>
      {/* Image */}
      <div className="relative aspect-video bg-[var(--bg-tertiary)]">
        {product.image ? (
          <img
            src={product.image}
            alt={t(product.title)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="package" size={48} className="text-[var(--text-muted)] opacity-50" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-2">
          {featured && (
            <span className="px-2 py-1 rounded-md bg-[var(--accent-amber)] text-black text-xs font-bold">
              ⭐ {language === 'fa' ? 'ویژه' : 'FEATURED'}
            </span>
          )}
          {product.soldOut && (
            <span className="px-2 py-1 rounded-md bg-[var(--accent-rose)] text-white text-xs font-bold">
              {language === 'fa' ? 'تمام شد' : 'SOLD OUT'}
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="px-2 py-1 rounded-md bg-[var(--accent-emerald)] text-black text-xs font-bold">
              −{product.discount}%
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <span className="text-xs text-[var(--primary)] font-medium">
          {product.category}
        </span>
        
        <h3 className="text-lg font-bold mt-1 mb-2 group-hover:gradient-text transition-colors">
          {t(product.title)}
        </h3>
        
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
          {t(product.description)}
        </p>
        
        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Price & Buy */}
        <div className="flex items-center justify-between">
          <div>
            {originalPrice() && (
              <span className="text-sm text-[var(--text-muted)] line-through me-2">
                {originalPrice()}
              </span>
            )}
            <span className="text-xl font-black gradient-text">
              {formatPrice()}
            </span>
          </div>
          
          <button
            onClick={handleBuy}
            disabled={product.soldOut}
            className="px-4 py-2 rounded-xl gradient-bg text-white font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.soldOut 
              ? (language === 'fa' ? 'ناموجود' : 'Sold Out')
              : (language === 'fa' ? 'خرید' : 'Buy')}
          </button>
        </div>
      </div>
    </div>
  );
}
