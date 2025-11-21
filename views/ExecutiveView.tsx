
import React from 'react';
import { TrendingUp, Shield, PoundSterling, Activity, PieChart, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

const ExecutiveView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Executive Overview</h1>
        <p className="text-zinc-500">High-level portfolio performance and strategic KPIs</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-blue-50 rounded-lg text-[#0f5c82]"><PoundSterling size={20} /></div>
             <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight size={12} /> 12.5%
             </span>
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">£42.8M</div>
          <div className="text-xs text-zinc-500 uppercase font-medium">Total Portfolio Value</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-green-50 rounded-lg text-green-600"><Shield size={20} /></div>
             <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight size={12} /> 0.59
             </span>
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">98.2%</div>
          <div className="text-xs text-zinc-500 uppercase font-medium">Safety Compliance Rating</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Activity size={20} /></div>
             <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded flex items-center gap-1">
                <ArrowDownRight size={12} /> 2%
             </span>
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">85%</div>
          <div className="text-xs text-zinc-500 uppercase font-medium">Resource Utilization</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><PieChart size={20} /></div>
             <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <ArrowUpRight size={12} /> 5 New
             </span>
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">12</div>
          <div className="text-xs text-zinc-500 uppercase font-medium">Active Major Projects</div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-zinc-800">Financial Performance (Trailing 12M)</h3>
                <div className="flex gap-2">
                    <span className="text-xs flex items-center gap-1 text-zinc-500"><div className="w-2 h-2 rounded-full bg-[#0f5c82]"></div> Revenue</span>
                    <span className="text-xs flex items-center gap-1 text-zinc-500"><div className="w-2 h-2 rounded-full bg-zinc-300"></div> Margin</span>
                </div>
            </div>
            <div className="h-64 w-full relative flex items-end gap-4 px-4">
                {[65, 70, 68, 74, 78, 82, 80, 85, 88, 92, 90, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group cursor-pointer">
                        <div className="w-full bg-[#0f5c82] rounded-t opacity-90 group-hover:opacity-100 transition-all relative" style={{ height: `${h}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">£{h/10}M</div>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-b" style={{ height: `${h * 0.3}%` }}></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-zinc-400 px-4">
                <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
            </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="font-bold text-zinc-800 mb-6">Risk Distribution</h3>
            <div className="flex-1 flex items-center justify-center relative">
                 {/* Simple Donut Chart CSS */}
                 <div className="w-48 h-48 rounded-full border-[24px] border-[#e4e4e7] relative rotate-45">
                    <div className="absolute -inset-[24px] rounded-full border-[24px] border-transparent border-t-[#ef4444] border-r-[#f97316]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-zinc-800">12%</span>
                        <span className="text-xs text-zinc-500 uppercase">High Risk</span>
                    </div>
                 </div>
            </div>
            <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-600"><div className="w-3 h-3 bg-[#ef4444] rounded-full"></div> Critical</span>
                    <span className="font-medium">3 Projects</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-600"><div className="w-3 h-3 bg-[#f97316] rounded-full"></div> Watchlist</span>
                    <span className="font-medium">5 Projects</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-600"><div className="w-3 h-3 bg-zinc-200 rounded-full"></div> On Track</span>
                    <span className="font-medium">4 Projects</span>
                </div>
            </div>
        </div>
      </div>

      {/* Strategic Initiatives */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-zinc-800">Strategic Initiatives</h3>
             <button className="text-sm text-[#0f5c82] font-medium hover:underline">View Roadmap</button>
        </div>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-lg bg-zinc-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Target size={20} /></div>
                    <div>
                        <h4 className="font-semibold text-zinc-900">Green Building Certification 2025</h4>
                        <p className="text-sm text-zinc-500">Achieve LEED Platinum for City Centre project</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-32">
                         <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Progress</span><span className="font-bold">75%</span></div>
                         <div className="h-1.5 w-full bg-zinc-200 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: '75%'}}></div></div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">On Track</span>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-lg bg-zinc-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><TrendingUp size={20} /></div>
                    <div>
                        <h4 className="font-semibold text-zinc-900">Digital Transformation Phase 2</h4>
                        <p className="text-sm text-zinc-500">Rollout AI scheduling to all regional teams</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-32">
                         <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Progress</span><span className="font-bold">40%</span></div>
                         <div className="h-1.5 w-full bg-zinc-200 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{width: '40%'}}></div></div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">At Risk</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default ExecutiveView;
