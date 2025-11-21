import React, { useState } from 'react';
import { Package, Search, Filter, AlertTriangle, ArrowDown, Plus, History, X } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { InventoryItem } from '../types';

const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ status: 'In Stock', threshold: 10, stock: 0 });

  const filteredInventory = inventory.filter(i => 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = inventory.filter(i => i.stock <= i.threshold).length;
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * (item.costPerUnit || 0)), 0);

  const handleCreate = () => {
      if (newItem.name && newItem.category) {
          const item: InventoryItem = {
              id: `INV-${Date.now()}`,
              name: newItem.name!,
              category: newItem.category!,
              stock: newItem.stock || 0,
              unit: newItem.unit || 'Units',
              threshold: newItem.threshold || 10,
              location: newItem.location || 'Unassigned',
              status: (newItem.stock || 0) === 0 ? 'Out of Stock' : (newItem.stock || 0) <= (newItem.threshold || 10) ? 'Low Stock' : 'In Stock',
              lastOrderDate: new Date().toISOString().split('T')[0],
              costPerUnit: newItem.costPerUnit || 0
          };
          addInventoryItem(item);
          setShowModal(false);
          setNewItem({ status: 'In Stock', threshold: 10, stock: 0 });
      }
  };

  const handleReorder = (id: string) => {
      // Simulate reorder by adding stock
      const item = inventory.find(i => i.id === id);
      if (item) {
          const newStock = item.stock + 50;
          updateInventoryItem(id, { 
              stock: newStock, 
              status: newStock > item.threshold ? 'In Stock' : 'Low Stock',
              lastOrderDate: new Date().toISOString().split('T')[0]
          });
          alert(`Reorder placed for ${item.name}. Stock updated.`);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Material Inventory</h1>
        <p className="text-zinc-500">Track stock levels, locations, and reordering</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
             <div className="p-3 bg-blue-50 text-[#0f5c82] rounded-lg"><Package size={24} /></div>
             <div>
                 <div className="text-2xl font-bold text-zinc-900">{inventory.length}</div>
                 <div className="text-xs text-zinc-500">Total SKUs</div>
             </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
             <div className="p-3 bg-green-50 text-green-600 rounded-lg"><ArrowDown size={24} /></div>
             <div>
                 <div className="text-2xl font-bold text-zinc-900">£{totalValue.toLocaleString()}</div>
                 <div className="text-xs text-zinc-500">Value In Stock</div>
             </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
             <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={24} /></div>
             <div>
                 <div className="text-2xl font-bold text-zinc-900">{lowStockCount}</div>
                 <div className="text-xs text-zinc-500">Low Stock Alerts</div>
             </div>
         </div>
          <div className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4 shadow-sm">
             <div className="p-3 bg-zinc-100 text-zinc-600 rounded-lg"><History size={24} /></div>
             <div>
                 <div className="text-2xl font-bold text-zinc-900">12</div>
                 <div className="text-xs text-zinc-500">Pending Orders</div>
             </div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 flex-1">
              <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent outline-none"
                  />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                  <Filter size={16} /> Category
              </button>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1f7d98] text-white rounded-lg text-sm font-medium hover:bg-[#166ba1] shadow-sm">
              <Plus size={16} /> Add Item
          </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-400 text-xs uppercase border-b border-zinc-100 sticky top-0 z-10">
                  <tr>
                      <th className="px-6 py-4 font-medium">Item Name</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Stock Level</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                  {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                          <td className="px-6 py-4">
                              <div className="font-medium text-zinc-900">{item.name}</div>
                              <div className="text-xs text-zinc-500 font-mono">{item.id}</div>
                          </td>
                          <td className="px-6 py-4 text-zinc-600">{item.category}</td>
                          <td className="px-6 py-4">
                              <div className="font-medium text-zinc-900">{item.stock} <span className="text-zinc-400 font-normal text-xs">{item.unit}</span></div>
                              {item.stock <= item.threshold && (
                                  <div className="text-[10px] text-orange-600 font-bold">Threshold: {item.threshold}</div>
                              )}
                          </td>
                          <td className="px-6 py-4 text-zinc-600">{item.location}</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                                  item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 
                                  'bg-red-100 text-red-700'
                              }`}>
                                  {item.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleReorder(item.id)}
                                className="text-[#0f5c82] hover:underline text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  Quick Reorder
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {filteredInventory.length === 0 && (
              <div className="p-10 text-center text-zinc-400 italic">No items found.</div>
          )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-zinc-900">Add Inventory Item</h3>
                      <button onClick={() => setShowModal(false)}><X size={20} className="text-zinc-400 hover:text-zinc-600" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Item Name</label>
                          <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Category</label>
                              <select className="w-full p-2 border border-zinc-200 rounded-lg text-sm bg-white" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                  <option value="">Select...</option>
                                  <option value="Raw Materials">Raw Materials</option>
                                  <option value="Safety Gear">Safety Gear</option>
                                  <option value="Consumables">Consumables</option>
                                  <option value="Tools">Tools</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Location</label>
                              <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm" value={newItem.location || ''} onChange={e => setNewItem({...newItem, location: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Initial Stock</label>
                              <input type="number" className="w-full p-2 border border-zinc-200 rounded-lg text-sm" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Unit</label>
                              <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm" placeholder="e.g. Bags" value={newItem.unit || ''} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Threshold</label>
                              <input type="number" className="w-full p-2 border border-zinc-200 rounded-lg text-sm" value={newItem.threshold} onChange={e => setNewItem({...newItem, threshold: parseInt(e.target.value)})} />
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Cost Per Unit (£)</label>
                          <input type="number" className="w-full p-2 border border-zinc-200 rounded-lg text-sm" value={newItem.costPerUnit} onChange={e => setNewItem({...newItem, costPerUnit: parseFloat(e.target.value)})} />
                      </div>
                  </div>
                  <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
                      <button onClick={handleCreate} disabled={!newItem.name || !newItem.category} className="px-6 py-2 bg-[#0f5c82] text-white font-bold rounded-lg hover:bg-[#0c4a6e] disabled:opacity-50">Add Item</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default InventoryView;