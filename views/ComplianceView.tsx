import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, FileText, PieChart } from 'lucide-react';

interface ChecklistItem {
    id: string;
    text: string;
    status: 'PASS' | 'FAIL' | 'PENDING';
    category: string;
}

const ComplianceView: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
      { id: '1', text: 'Site perimeter fencing secure and signed', status: 'PASS', category: 'Site Safety' },
      { id: '2', text: 'PPE requirements posted at all entrances', status: 'PASS', category: 'Site Safety' },
      { id: '3', text: 'Fire extinguishers inspected (monthly tag)', status: 'PENDING', category: 'Fire Safety' },
      { id: '4', text: 'Electrical panels locked and labeled', status: 'FAIL', category: 'Electrical' },
      { id: '5', text: 'Scaffolding tagged by competent person', status: 'PENDING', category: 'Working at Height' },
      { id: '6', text: 'First aid kit stocked and accessible', status: 'PASS', category: 'Health' },
  ]);

  const toggleStatus = (id: string, status: 'PASS' | 'FAIL' | 'PENDING') => {
      setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const passCount = items.filter(i => i.status === 'PASS').length;
  const failCount = items.filter(i => i.status === 'FAIL').length;
  const total = items.length;
  const score = Math.round((passCount / total) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
            <ShieldCheck className="text-[#0f5c82]" /> Compliance Audit
        </h1>
        <p className="text-zinc-500">Digital safety inspections and regulatory tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 mb-4">
                  <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#f4f4f5" strokeWidth="12" />
                      <circle 
                        cx="80" cy="80" r="70" 
                        fill="none" 
                        stroke={score > 80 ? '#22c55e' : score > 50 ? '#f59e0b' : '#ef4444'} 
                        strokeWidth="12" 
                        strokeDasharray="440" 
                        strokeDashoffset={440 - (440 * score) / 100} 
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-zinc-900">{score}%</span>
                      <span className="text-xs text-zinc-500 uppercase font-bold">Compliance</span>
                  </div>
              </div>
              <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-zinc-700">{passCount} Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-zinc-700">{failCount} Fail</span>
                  </div>
              </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-800">Daily Site Inspection</h3>
                  <span className="text-xs text-zinc-500">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="divide-y divide-zinc-100">
                  {items.map(item => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors group">
                          <div className="flex items-start gap-3">
                              <div className={`mt-1 p-1 rounded ${item.status === 'FAIL' ? 'bg-red-100 text-red-600' : item.status === 'PASS' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                  {item.status === 'FAIL' ? <AlertTriangle size={16} /> : item.status === 'PASS' ? <Check size={16} /> : <FileText size={16} />}
                              </div>
                              <div>
                                  <div className="text-sm font-medium text-zinc-900">{item.text}</div>
                                  <div className="text-xs text-zinc-500">{item.category}</div>
                              </div>
                          </div>
                          
                          <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => toggleStatus(item.id, 'PASS')}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'PASS' ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-green-100 hover:text-green-600'}`}
                              >
                                  PASS
                              </button>
                              <button 
                                onClick={() => toggleStatus(item.id, 'FAIL')}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'FAIL' ? 'bg-red-500 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-600'}`}
                              >
                                  FAIL
                              </button>
                              <button 
                                onClick={() => toggleStatus(item.id, 'PENDING')}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${item.status === 'PENDING' ? 'bg-orange-400 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-orange-100 hover:text-orange-600'}`}
                              >
                                  N/A
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                  <button className="px-6 py-2 bg-[#0f5c82] text-white rounded-lg font-medium hover:bg-[#0c4a6e] shadow-sm">
                      Submit Audit Report
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ComplianceView;