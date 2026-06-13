import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { DollarSign, Plus, Calendar, Settings, TrendingDown, ArrowDownRight, Tag } from 'lucide-react';

export const Finance = () => {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Expense modal state
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'inventory',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchFinanceData = async () => {
    try {
      const [expRes, analyticsRes] = await Promise.all([
        apiFetch('/finance/expenses').then(res => res.json()),
        apiFetch('/finance/analytics').then(res => res.json())
      ]);

      if (expRes.success) setExpenses(expRes.expenses);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFinanceData().then(() => setLoading(false));
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newExpense.amount || !newExpense.date) {
      setErrorMsg('Date and Amount are required.');
      return;
    }

    try {
      const response = await apiFetch('/finance/expenses', {
        method: 'POST',
        body: JSON.stringify(newExpense)
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        setNewExpense({
          category: 'inventory',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchFinanceData();
      } else {
        setErrorMsg(data.message || 'Failed to record expense.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-stone-200">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-outfit text-white tracking-wider uppercase">FINANCIAL LEDGER</h1>
          <span className="text-xs text-stone-400 font-sans mt-1">Review operational costs, ledger balance, and cashflow margins.</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider gold-gradient-bg text-forest rounded shadow-md flex items-center gap-2"
        >
          <Plus size={14} /> Log Business Expense
        </button>
      </div>

      {/* Cashflow Metrics Grid */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">YEARLY REVENUE (SALES)</span>
              <span className="text-xl font-bold font-outfit text-white">${analytics.yearlyRevenue.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-full border border-gold/25">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">TOTAL EXPENSES (OUTFLOW)</span>
              <span className="text-xl font-bold font-outfit text-rose-400">${analytics.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div className="bg-luxury-dark border border-luxury-gray p-6 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-outfit text-[10px] font-bold text-stone-400 tracking-wider uppercase">NET PROFITS (CASHFLOW)</span>
              <span className={`text-xl font-bold font-outfit ${analytics.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${analytics.totalProfit.toFixed(2)}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>
        </div>
      )}

      {/* Expenses ledger table */}
      <div className="bg-luxury-dark border border-luxury-gray rounded-lg p-5 flex flex-col gap-4">
        <h3 className="font-outfit text-xs font-bold text-white tracking-wider uppercase border-b border-luxury-gray pb-3">TRANSACTION LOGS</h3>
        
        {expenses.length === 0 ? (
          <div className="py-12 text-center text-stone-500 font-outfit text-xs select-none">
            No expenses logged in database ledger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-luxury-gray text-stone-400 font-outfit uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-gray text-stone-300">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-stone-800/20">
                    <td className="py-3.5 px-4 font-mono">{exp.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-outfit text-[9px] font-bold uppercase tracking-wider border ${
                        exp.category === 'salary' ? 'bg-indigo-950/45 text-indigo-400 border-indigo-500/20' :
                        exp.category === 'rent' ? 'bg-amber-950/45 text-amber-400 border-amber-500/20' :
                        exp.category === 'inventory' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate" title={exp.description}>{exp.description || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-right font-outfit font-bold text-rose-400">-${exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOG EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-luxury-dark border-2 border-gold max-w-md w-full rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-luxury-gray flex items-center justify-between">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">RECORD BUSINESS EXPENSE</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 flex flex-col gap-4 font-sans text-xs text-stone-300">
              {errorMsg && (
                <div className="bg-rose-950/20 border border-rose-500/35 text-rose-300 p-2 rounded">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Expense Category *</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-luxury-black border border-luxury-gray text-stone-300 p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                >
                  <option value="inventory">Inventory restocking</option>
                  <option value="rent">Studio Rent / Lease</option>
                  <option value="utilities">Utilities (Water, Power)</option>
                  <option value="marketing">Advertising & Marketing</option>
                  <option value="salary">Employee Wages / Commissions</option>
                  <option value="other">Other / Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. 350.00"
                    className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Transaction Date *</label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-outfit text-[9px] font-bold text-stone-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details of purchase or invoice..."
                  rows={3}
                  className="bg-luxury-black border border-luxury-gray text-white p-2.5 rounded text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-4 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-stone-400 hover:text-white uppercase tracking-wider font-outfit text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded font-outfit text-[10px] font-bold uppercase tracking-widest gold-gradient-bg text-forest shadow"
                >
                  Record Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Finance;
