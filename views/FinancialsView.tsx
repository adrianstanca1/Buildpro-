
import React, { useState } from 'react';
import { PoundSterling, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';

const FinancialsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'CASHFLOW' | 'BUDGET'>('CASHFLOW');

  const costCodes = [
      { code: '03-3000', desc: 'Concrete', budget: 250000, spent: 210000, var: 16 },
      { code: '05-1200', desc: 'Structural Steel', budget: 400000, spent: 380000, var: 5 },
      { code: '09-2000', desc: 'Plaster & Gypsum', budget: 120000, spent: 45000, var: -62 },
      { code: '15-4000', desc: 'Plumbing', budget: 180000, spent: 175000, var: 3 },
      { code: '16-1000', desc: 'Electrical', budget: 220000, spent: 235000, var: 7 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
                <PoundSterling className="text-[#0f5c82]" /> Financial Command
            </h1>
            <p className="text-zinc-500">Real-time budget tracking and cost control.</p>
        </div>
        <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('CASHFLOW')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'CASHFLOW' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                Cash Flow
            </button>
            <button 
                onClick={() => setViewMode('BUDGET')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'BUDGET' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
                Budget Variance
            </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="text-zinc-500 text-xs font-bold uppercase">Total Revenue</div>
                  <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-bold">+15%</span>
              </div>
              <div className="text-3xl font-bold text-zinc-900">£8.5M</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="text-zinc-500 text-xs font-bold uppercase">Total Costs</div>
                  <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded font-bold">+8%</span>
              </div>
              <div className="text-3xl font-bold text-zinc-900">£6.2M</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="text-zinc-500 text-xs font-bold uppercase">Net Profit</div>
                  <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-bold">+22%</span>
              </div>
              <div className="text-3xl font-bold text-[#0f5c82]">£2.3M</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="text-zinc-500 text-xs font-bold uppercase">Margin</div>
              </div>
              <div className="text-3xl font-bold text-zinc-900">27%</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-zinc-800">
                      {viewMode === 'CASHFLOW' ? 'Cash Flow Analysis (YTD)' : 'Budget vs Actual by Phase'}
                  </h3>
                  <button className="text-zinc-400 hover:text-[#0f5c82]"><Download size={18} /></button>
              </div>
              
              <div className="flex-1 relative w-full flex items-end gap-4 px-4 border-b border-l border-zinc-100">
                  {[65, 72, 68, 84, 76, 92, 88, 95, 82, 78, 85, 90].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full gap-1 group cursor-pointer">
                          <div 
                            className="w-full bg-[#0f5c82] rounded-t opacity-90 group-hover:opacity-100 transition-all relative" 
                            style={{ height: `${h}%` }}
                          >
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                   Rev: £{h}0k
                               </div>
                          </div>
                          {viewMode === 'CASHFLOW' && (
                              <div 
                                className="w-full bg-zinc-300 rounded-b opacity-80" 
                                style={{ height: `${h * 0.6}%` }}
                              ></div>
                          )}
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-400 px-4">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
              </div>
          </div>

          {/* Cost Code Breakdown */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-zinc-800">Cost Breakdown</h3>
                  <button className="text-zinc-400 hover:text-[#0f5c82]"><Filter size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                  {costCodes.map((item, i) => (
                      <div key={i} className="group cursor-pointer">
                          <div className="flex justify-between text-sm font-medium text-zinc-800 mb-1">
                              <span>{item.desc}</span>
                              <span>£{(item.spent / 1000).toFixed(0)}k / £{(item.budget / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mb-1 relative">
                              <div 
                                className={`h-full rounded-full ${item.var > 0 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                style={{width: `${Math.min(100, (item.spent / item.budget) * 100)}%`}}
                              ></div>
                          </div>
                          <div className="flex justify-between text-xs">
                              <span className="text-zinc-400 font-mono">{item.code}</span>
                              <span className={item.var > 0 ? 'text-red-500' : 'text-green-500'}>
                                  {item.var > 0 ? `+${item.var}% Over` : `${item.var}% Under`}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
              <button className="mt-4 w-full py-2 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                  View Full Report
              </button>
          </div>
      </div>
    </div>
  );
};

export default FinancialsView;
