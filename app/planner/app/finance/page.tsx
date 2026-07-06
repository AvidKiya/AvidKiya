'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState, LoadingSkeleton, ErrorState } from '@/components/ui/states';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  date: string;
  createdAt: string;
}

const categoryIcons: Record<string, string> = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  bills: '📄',
  entertainment: '🎮',
  salary: '💰',
  freelance: '💻',
  other: '📦',
};

const categoryLabels: Record<string, string> = {
  food: 'خوراک',
  transport: 'حمل و نقل',
  shopping: 'خرید',
  bills: ' قبض',
  entertainment: 'سرگرمی',
  salary: 'حقوق',
  freelance: 'فریلنسری',
  other: 'سایر',
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState<{
    type: 'income' | 'expense';
    amount: string;
    category: string;
    date: string;
  }>({
    type: 'expense',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Mock data
      setTransactions([
        { id: '1', type: 'income', amount: 500, category: 'salary', date: '2024-01-15', createdAt: new Date().toISOString() },
        { id: '2', type: 'expense', amount: 50, category: 'food', date: '2024-01-14', createdAt: new Date().toISOString() },
        { id: '3', type: 'expense', amount: 120, category: 'shopping', date: '2024-01-13', createdAt: new Date().toISOString() },
        { id: '4', type: 'income', amount: 200, category: 'freelance', date: '2024-01-12', createdAt: new Date().toISOString() },
      ]);
      setLoading(false);
    } catch (err) {
      setError('خطا در بارگذاری تراکنش‌ها');
      setLoading(false);
    }
  };

  const addTransaction = () => {
    if (!newTransaction.amount) return;

    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: newTransaction.type,
      amount: Number(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setNewTransaction({ type: 'expense', amount: '', category: 'other', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryBreakdown = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  if (loading) return <LoadingSkeleton count={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchTransactions} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مالی</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + تراکنش جدید
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="text-sm text-text-2 mb-1">درآمد</div>
          <div className="text-2xl font-bold text-green-400">${totalIncome}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-text-2 mb-1">هزینه</div>
          <div className="text-2xl font-bold text-red-400">${totalExpense}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-text-2 mb-1">مانده</div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-400'}`}>
            ${balance}
          </div>
        </GlassCard>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <GlassCard>
          <h2 className="font-bold mb-4">تفکیک هزینه‌ها</h2>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-xl">{categoryIcons[category] || '📦'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{categoryLabels[category] || category}</span>
                      <span className="text-sm text-text-2">${amount}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(amount / totalExpense) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      )}

      {/* Add Transaction Form */}
      {showAddForm && (
        <GlassCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="expense">هزینه</option>
              <option value="income">درآمد</option>
            </select>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              placeholder="مبلغ"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={addTransaction} className="glass-btn-primary px-4 py-2 flex-1">
                افزودن
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="glass-btn px-4 py-2"
              >
                انصراف
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <GlassCard key={transaction.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {categoryIcons[transaction.category || 'other'] || '📦'}
                </span>
                <div>
                  <div className="font-bold">
                    {categoryLabels[transaction.category || 'other'] || transaction.category}
                  </div>
                  <div className="text-xs text-text-3">{transaction.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </span>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {transactions.length === 0 && !showAddForm && (
        <EmptyState
          icon="💰"
          title="هنوز تراکنشی ندارید"
          description="اولین تراکنش خود را اضافه کنید."
          action={{ label: '+ افزودن تراکنش', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}