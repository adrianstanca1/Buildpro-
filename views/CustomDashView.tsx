import React from 'react';
import { Layout, Save, Download, Share2 } from 'lucide-react';

const CustomDashView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Custom Dashboard</h1>
        <p className="text-zinc-500">Drag-and-drop widgets, role-specific views, 50+ widget library</p>
      </div>

      <div className="flex gap-2 mb-8">
          <button className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-zinc-200">
              <Layout size={14} /> Add Widget
          </button>
          <button className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-zinc-200">
              <Save size={14} /> Save Layout
          </button>
          <button className="bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-zinc-200">
              <Download size={14} /> Load Template
          </button>
          <button className="bg-[#1f7d98] text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-[#166ba1]">
              <Share2 size={14} /> Share Dashboard
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-[#0f5c82] text-3xl font-bold mb-1">87</div>
              <div className="text-xs text-zinc-500">Portfolio Health</div>
              <div className="text-green-600 text-xs font-medium">↑ +2 pts</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-green-600 text-3xl font-bold mb-1">$2.3M</div>
              <div className="text-xs text-zinc-500">Profit YTD</div>
              <div className="text-green-600 text-xs font-medium">↑ +22%</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-zinc-900 text-3xl font-bold mb-1">18%</div>
              <div className="text-xs text-zinc-500">Avg Margin</div>
              <div className="text-red-600 text-xs font-medium">↓ -1.2%</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-orange-600 text-3xl font-bold mb-1">3</div>
              <div className="text-xs text-zinc-500">Projects at Risk</div>
              <div className="text-zinc-500 text-xs font-medium">⚠ Attention</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 h-80">
              <h3 className="font-semibold text-zinc-800 mb-4">Project Portfolio Matrix</h3>
              <div className="relative h-full w-full border-l border-b border-zinc-200 pb-8 pl-2">
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-zinc-400">Risk Level</div>
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 text-xs text-zinc-400 -ml-6">Profit Margin %</div>
                  
                  {/* Dots */}
                  <div className="absolute bottom-[20%] left-[30%] w-4 h-4 rounded-full bg-[#22d3ee]"></div>
                  <div className="absolute bottom-[50%] left-[40%] w-4 h-4 rounded-full bg-[#22d3ee]"></div>
                  <div className="absolute bottom-[60%] left-[50%] w-4 h-4 rounded-full bg-[#22d3ee]"></div>
                  <div className="absolute bottom-[70%] left-[70%] w-4 h-4 rounded-full bg-[#22d3ee]"></div>
                  <div className="absolute bottom-[85%] left-[80%] w-4 h-4 rounded-full bg-[#22d3ee]"></div>
                  
                  <div className="w-full h-full grid grid-cols-10 grid-rows-6 pointer-events-none">
                     {[...Array(60)].map((_, i) => <div key={i} className="border-r border-t border-zinc-50"></div>)}
                  </div>
              </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 h-80">
              <div className="flex justify-between">
                  <h3 className="font-semibold text-zinc-800">Cash Flow Forecast</h3>
                  <Download size={14} className="text-[#0f5c82]" />
              </div>
              <div className="relative h-full w-full flex items-end pt-8 pb-4">
                   <svg className="w-full h-full overflow-visible">
                       <polyline points="0,100 100,80 200,70 300,75 400,50 500,30" fill="none" stroke="#22d3ee" strokeWidth="3" />
                       <circle cx="0" cy="100" r="3" fill="#22d3ee" />
                       <circle cx="100" cy="80" r="3" fill="#22d3ee" />
                       <circle cx="200" cy="70" r="3" fill="#22d3ee" />
                       <circle cx="300" cy="75" r="3" fill="#22d3ee" />
                       <circle cx="400" cy="50" r="3" fill="#22d3ee" />
                       <circle cx="500" cy="30" r="3" fill="#22d3ee" />
                       {/* Area fill hint */}
                       <path d="M0,100 L100,80 L200,70 L300,75 L400,50 L500,30 L500,150 L0,150 Z" fill="#22d3ee" fillOpacity="0.1" />
                   </svg>
                   <div className="absolute bottom-0 w-full flex justify-between text-xs text-zinc-400">
                       <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                   </div>
                   <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-400">
                       <span>1.6</span><span>1.0</span><span>0</span>
                   </div>
              </div>
              <div className="flex justify-center text-xs text-zinc-500 gap-2 mt-[-20px]">
                  <span className="w-4 h-1 bg-[#22d3ee]"></span> Forecast
              </div>
          </div>
      </div>
    </div>
  );
};

export default CustomDashView;