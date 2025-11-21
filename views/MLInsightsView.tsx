
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Zap, RefreshCw, Activity, Brain, CheckCircle2, XCircle } from 'lucide-react';

const MLInsightsView: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(82);
  const [projectedRisk, setProjectedRisk] = useState(65);
  const [inferenceLog, setInferenceLog] = useState<string[]>([
      "Model initialized: Construction_Risk_v4.2",
      "Connected to live site sensors...",
      "Analyzing historical weather data patterns..."
  ]);

  const runSimulation = () => {
    setIsSimulating(true);
    setInferenceLog(prev => ["Initiating Monte Carlo Simulation (n=10,000)...", ...prev]);
    
    setTimeout(() => setInferenceLog(prev => ["Detecting resource bottlenecks in Phase 3...", ...prev]), 800);
    setTimeout(() => setInferenceLog(prev => ["Re-aligning schedule with weather forecast...", ...prev]), 1600);
    setTimeout(() => setInferenceLog(prev => ["Optimizing procurement delivery windows...", ...prev]), 2400);
    
    setTimeout(() => {
        setIsSimulating(false);
        setOptimizationScore(94);
        setProjectedRisk(22);
        setInferenceLog(prev => ["Simulation Complete. Optimization Plan #428 recommended.", ...prev]);
    }, 3200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
                <Brain className="text-[#0f5c82]" /> Machine Learning Center
            </h1>
            <p className="text-zinc-500">Predictive analytics engine and schedule optimization.</p>
        </div>
        <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${
                isSimulating ? 'bg-zinc-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105'
            }`}
        >
            {isSimulating ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
            {isSimulating ? 'Running Simulation...' : 'Run Predictive Model'}
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white border border-zinc-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={64} /></div>
              <div className="relative z-10">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Efficiency Score</div>
                  <div className="flex items-end gap-3">
                      <div className={`text-4xl font-bold transition-all duration-1000 ${isSimulating ? 'blur-sm' : ''} ${optimizationScore > 90 ? 'text-green-600' : 'text-zinc-900'}`}>
                          {optimizationScore}%
                      </div>
                      {optimizationScore > 90 && <div className="text-green-600 text-sm font-bold mb-1.5">↑ Optimized</div>}
                  </div>
              </div>
          </div>
          
          <div className="bg-white border border-zinc-200 rounded-xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><AlertTriangle size={64} /></div>
              <div className="relative z-10">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Risk Probability</div>
                  <div className="flex items-end gap-3">
                      <div className={`text-4xl font-bold transition-all duration-1000 ${isSimulating ? 'blur-sm' : ''} ${projectedRisk < 30 ? 'text-green-600' : 'text-red-600'}`}>
                          {projectedRisk}%
                      </div>
                      <div className={`text-sm font-bold mb-1.5 ${projectedRisk < 30 ? 'text-green-600' : 'text-red-600'}`}>
                          {projectedRisk < 30 ? 'Low Risk' : 'Critical'}
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-300 font-mono text-xs flex flex-col h-36">
              <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-100 flex items-center gap-2"><Activity size={14} /> Inference Log</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 overflow-y-auto space-y-1.5 scrollbar-hide">
                      {inferenceLog.map((log, i) => (
                          <div key={i} className="truncate opacity-80 hover:opacity-100">
                              <span className="text-blue-500 mr-2">&gt;</span>{log}
                          </div>
                      ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none h-8 top-auto bottom-0"></div>
              </div>
          </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-zinc-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#0f5c82]" /> Projected Timeline Deviation
              </h3>
              <div className="h-80 w-full relative">
                   {/* Chart Area */}
                   <div className="absolute inset-0 flex items-end gap-1 pl-8 pb-6 border-l border-b border-zinc-200">
                       {/* Y Axis Labels */}
                       <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-zinc-400 py-2">
                           <span>+30d</span><span>+15d</span><span>0d</span><span>-15d</span>
                       </div>

                       {/* Bars */}
                       {[10, 15, 22, 18, 25, 30, 12, 5, -5, -10, -8, -12].map((val, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                               {/* Bar */}
                               <div className="w-full bg-zinc-100 h-full relative overflow-hidden rounded-t-sm">
                                   {/* Baseline */}
                                   <div className="absolute top-1/2 w-full border-t border-zinc-300 border-dashed"></div>
                                   
                                   {/* Value Bar */}
                                   <div 
                                        className={`absolute left-1 right-1 transition-all duration-1000 ease-out ${val > 0 ? 'bottom-1/2 bg-red-400' : 'top-1/2 bg-green-400'}`}
                                        style={{ 
                                            height: `${Math.abs(isSimulating ? Math.random() * 30 : (optimizationScore > 90 ? val - 15 : val))}%` 
                                        }}
                                   ></div>
                               </div>
                               
                               {/* Tooltip */}
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                   Wk {i+1}: {optimizationScore > 90 ? (val - 15) : val}d
                               </div>
                           </div>
                       ))}
                   </div>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Delay Risk</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-sm"></div> Time Savings</div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-800 mb-4">Optimization Suggestions</h3>
                  <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-green-800 text-sm">Parallelize Phases</span>
                              <CheckCircle2 size={14} className="text-green-600" />
                          </div>
                          <p className="text-xs text-green-700">Run electrical rough-in alongside plumbing to save 4 days.</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                           <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-blue-800 text-sm">Supplier Switch</span>
                              <CheckCircle2 size={14} className="text-blue-600" />
                          </div>
                          <p className="text-xs text-blue-700">Switch concrete supplier to 'MetroMix' for better reliability score (98%).</p>
                      </div>
                      {!isSimulating && optimizationScore < 90 && (
                          <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg opacity-50">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-orange-800 text-sm">Overtime Allocation</span>
                                  <XCircle size={14} className="text-orange-600" />
                              </div>
                              <p className="text-xs text-orange-700">Not recommended due to budget constraints.</p>
                          </div>
                      )}
                  </div>
              </div>

              <div className="bg-gradient-to-br from-[#0f5c82] to-[#0c4a6e] rounded-xl p-6 text-white shadow-md">
                  <h3 className="font-bold mb-2">Projected Savings</h3>
                  <div className="text-3xl font-bold mb-1">
                      £{isSimulating ? '---,---' : (optimizationScore > 90 ? '142,500' : '45,000')}
                  </div>
                  <div className="text-blue-200 text-xs mb-4">Potential cost reduction via optimization</div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full transition-all duration-1000" style={{width: isSimulating ? '0%' : (optimizationScore > 90 ? '85%' : '30%')}}></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MLInsightsView;
