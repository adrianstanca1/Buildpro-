
import React, { useState } from 'react';
import { ShoppingCart, Package, Truck, BarChart3, Plus, Search, Filter, Check, AlertCircle, Sparkles } from 'lucide-react';

const ProcurementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VENDORS' | 'ORDERS' | 'INVENTORY'>('VENDORS');
  const [showSmartPO, setShowSmartPO] = useState(false);
  const [poGenerating, setPoGenerating] = useState(false);

  const vendors = [
    { name: 'Premier Steel', rating: 92, activeOrders: 2, spend: '£205k', status: 'Preferred' },
    { name: 'Elite Equipment', rating: 88, activeOrders: 1, spend: '£315k', status: 'Active' },
    { name: 'Metro Concrete', rating: 74, activeOrders: 0, spend: '£85k', status: 'Review' },
    { name: 'City Lumber Supply', rating: 95, activeOrders: 4, spend: '£120k', status: 'Preferred' },
  ];

  const handleGeneratePO = () => {
      setPoGenerating(true);
      setTimeout(() => {
          setPoGenerating(false);
          setShowSmartPO(false);
          alert("Purchase Order #PO-2025-889 created and sent for approval.");
      }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
                <ShoppingCart className="text-[#0f5c82]" /> Intelligent Procurement
            </h1>
            <p className="text-zinc-500">Vendor management, smart reordering, and supply chain tracking.</p>
        </div>
        <button 
            onClick={() => setShowSmartPO(true)}
            className="bg-[#0f5c82] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c4a6e] shadow-lg flex items-center gap-2 transition-all"
        >
            <Sparkles size={18} className="text-yellow-300" /> Smart Reorder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-200 mb-6">
          {['VENDORS', 'ORDERS', 'INVENTORY'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab 
                    ? 'border-[#0f5c82] text-[#0f5c82]' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                  {tab === 'VENDORS' && <Truck size={16} />}
                  {tab === 'ORDERS' && <Package size={16} />}
                  {tab === 'INVENTORY' && <BarChart3 size={16} />}
                  {tab}
              </button>
          ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-zinc-100 flex justify-between bg-zinc-50">
              <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-1 focus:ring-[#0f5c82] outline-none" />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-lg bg-white text-zinc-600 text-sm hover:bg-zinc-50">
                  <Filter size={16} /> Filter
              </button>
          </div>

          {activeTab === 'VENDORS' && (
              <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs">
                      <tr>
                          <th className="px-6 py-4 font-medium">Vendor Name</th>
                          <th className="px-6 py-4 font-medium">Performance</th>
                          <th className="px-6 py-4 font-medium">Active Orders</th>
                          <th className="px-6 py-4 font-medium">Total Spend</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                      {vendors.map((v, i) => (
                          <tr key={i} className="hover:bg-zinc-50 transition-colors group">
                              <td className="px-6 py-4 font-bold text-zinc-800">{v.name}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <div className="w-16 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                          <div className={`h-full ${v.rating >= 90 ? 'bg-green-500' : v.rating >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{width: `${v.rating}%`}}></div>
                                      </div>
                                      <span className="text-xs font-medium text-zinc-500">{v.rating}/100</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-zinc-600">{v.activeOrders}</td>
                              <td className="px-6 py-4 font-mono text-zinc-600">{v.spend}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                      v.status === 'Preferred' ? 'bg-purple-100 text-purple-700' :
                                      v.status === 'Active' ? 'bg-green-100 text-green-700' :
                                      'bg-zinc-100 text-zinc-600'
                                  }`}>{v.status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-[#0f5c82] hover:underline text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}

          {activeTab === 'ORDERS' && (
               <div className="p-12 text-center text-zinc-400">
                   <Package size={48} className="mx-auto mb-4 opacity-20" />
                   <p>No active orders found for current filter.</p>
               </div>
          )}

          {activeTab === 'INVENTORY' && (
               <div className="p-12 text-center text-zinc-400">
                   <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                   <p>Inventory analysis module loading...</p>
               </div>
          )}
      </div>

      {/* Smart PO Modal */}
      {showSmartPO && (
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="bg-[#0f5c82] p-6 text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles size={20} /> AI Smart Reorder</h3>
                      <p className="text-blue-100 text-sm mt-1">Based on current consumption rates and project schedule.</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <div className="text-xs font-bold text-blue-800 uppercase mb-2">Recommendation</div>
                          <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-zinc-900">Portland Cement Type I</span>
                              <span className="font-bold text-zinc-900">400 Bags</span>
                          </div>
                          <p className="text-xs text-zinc-500">Inventory projected to deplete in 3 days. Vendor 'Premier Steel' has best lead time (2 days).</p>
                      </div>

                      <div className="border border-zinc-200 rounded-xl p-4">
                          <div className="flex justify-between text-sm mb-2">
                              <span className="text-zinc-500">Unit Price</span>
                              <span className="font-mono text-zinc-900">£12.50</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                              <span className="text-zinc-500">Subtotal</span>
                              <span className="font-mono text-zinc-900">£5,000.00</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold pt-2 border-t border-zinc-100">
                              <span className="text-zinc-800">Total Estimate</span>
                              <span className="font-mono text-[#0f5c82]">£5,000.00</span>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex gap-3">
                      <button 
                        onClick={() => setShowSmartPO(false)}
                        className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-white transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleGeneratePO}
                        disabled={poGenerating}
                        className="flex-1 py-3 bg-[#0f5c82] text-white rounded-xl font-bold hover:bg-[#0c4a6e] transition-colors flex justify-center items-center gap-2"
                      >
                          {poGenerating ? 'Processing...' : 'Generate PO'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProcurementView;
