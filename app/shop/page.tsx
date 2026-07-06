'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'فروشگاه — AvidKiya' };

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  category: string;
  featured?: boolean;
  discount?: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'پکیج آموزش React',
    description: 'آموزش جامع React از مبتدی تا حرفه‌ای',
    price: 29.99,
    currency: 'USD',
    category: 'آموزش',
    featured: true,
    discount: 20,
  },
  {
    id: '2',
    title: 'قالب داشبورد',
    description: 'قالب آماده داشبورد مدیریتی',
    price: 19.99,
    currency: 'USD',
    category: 'قالب',
  },
  {
    id: '3',
    title: 'ابزار CLI',
    description: 'ابزار خط فرمان برای مدیریت پروژه',
    price: 9.99,
    currency: 'USD',
    category: 'ابزار',
  },
];

const currencies = ['USD', 'EUR', 'IRR', 'TMN', 'USDT'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.includes(searchQuery) || p.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">فروشگاه</h1>
        <p className="text-text-2">محصولات دیجیتال با کیفیت</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-text-2 hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'همه' : cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو..."
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
          />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <GlassCard key={product.id}>
            <div className="relative mb-4">
              {product.discount && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              )}
              {product.featured && (
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  ویژه
                </span>
              )}
              <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
            </div>

            <div className="text-xs text-text-3 mb-1">{product.category}</div>
            <h3 className="font-bold mb-2">{product.title}</h3>
            <p className="text-text-2 text-sm mb-4">{product.description}</p>

            <div className="flex items-center justify-between">
              <div>
                {product.discount ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-sm text-text-3 line-through">
                      ${product.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                )}
                <div className="text-xs text-text-3">{selectedCurrency}</div>
              </div>

              <button className="glass-btn-primary px-4 py-2">
                خرید
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-text-3 py-12">
          محصولی یافت نشد
        </div>
      )}
    </div>
  );
}