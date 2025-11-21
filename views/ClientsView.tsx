import React, { useState } from 'react';
import { Building, Phone, Mail, MoreHorizontal, Star, Plus, X, Search } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { Client } from '../types';

const ClientsView: React.FC = () => {
  const { clients, addClient } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ status: 'Active', tier: 'Silver' });

  const filteredClients = clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
      if (newClient.name && newClient.email) {
          const client: Client = {
              id: `c-${Date.now()}`,
              name: newClient.name!,
              contactPerson: newClient.contactPerson || 'Unknown',
              role: newClient.role || 'Contact',
              email: newClient.email!,
              phone: newClient.phone || '',
              status: newClient.status as any || 'Active',
              tier: newClient.tier as any || 'Silver',
              activeProjects: 0,
              totalValue: '£0'
          };
          addClient(client);
          setShowModal(false);
          setNewClient({ status: 'Active', tier: 'Silver' });
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">Clients & CRM</h1>
            <p className="text-zinc-500">Manage client relationships and contacts</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1f7d98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#166ba1] shadow-sm"
        >
            <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent outline-none"
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
          {filteredClients.map((client) => (
              <div key={client.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-[#0f5c82] transition-colors">
                          <Building size={24} />
                      </div>
                      <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={20} /></button>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 mb-1 truncate">{client.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                       <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                           client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                       }`}>{client.status}</span>
                       <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                           <Star size={12} fill="currentColor" /> {client.tier}
                       </span>
                  </div>

                  <div className="space-y-3 border-t border-zinc-50 pt-4">
                      <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0f5c82] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {client.contactPerson.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="overflow-hidden">
                              <div className="text-sm font-medium text-zinc-900 truncate">{client.contactPerson}</div>
                              <div className="text-xs text-zinc-500 truncate">{client.role}</div>
                          </div>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                          <div className="flex items-center gap-2 text-sm text-zinc-600">
                              <Mail size={14} className="text-zinc-400" />
                              <span className="truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-600">
                              <Phone size={14} className="text-zinc-400" />
                              <span>{client.phone}</span>
                          </div>
                      </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-50 flex justify-between items-center">
                      <span className="text-xs text-zinc-500">{client.activeProjects} Active Projects</span>
                      <button className="text-[#0f5c82] text-xs font-medium hover:underline">View Details</button>
                  </div>
              </div>
          ))}
      </div>

      {/* Add Client Modal */}
      {showModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-zinc-900">Add New Client</h3>
                      <button onClick={() => setShowModal(false)}><X size={20} className="text-zinc-400 hover:text-zinc-600" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Company Name</label>
                          <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newClient.name || ''} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Contact Person</label>
                              <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newClient.contactPerson || ''} onChange={e => setNewClient({...newClient, contactPerson: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Role</label>
                              <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newClient.role || ''} onChange={e => setNewClient({...newClient, role: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Email</label>
                              <input type="email" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newClient.email || ''} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Phone</label>
                              <input type="text" className="w-full p-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82]" value={newClient.phone || ''} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Tier</label>
                              <select className="w-full p-2 border border-zinc-200 rounded-lg text-sm bg-white" value={newClient.tier} onChange={e => setNewClient({...newClient, tier: e.target.value as any})}>
                                  <option value="Platinum">Platinum</option>
                                  <option value="Gold">Gold</option>
                                  <option value="Silver">Silver</option>
                                  <option value="Government">Government</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Status</label>
                              <select className="w-full p-2 border border-zinc-200 rounded-lg text-sm bg-white" value={newClient.status} onChange={e => setNewClient({...newClient, status: e.target.value as any})}>
                                  <option value="Active">Active</option>
                                  <option value="Lead">Lead</option>
                                  <option value="Inactive">Inactive</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
                      <button onClick={handleCreate} disabled={!newClient.name || !newClient.email} className="px-6 py-2 bg-[#0f5c82] text-white font-bold rounded-lg hover:bg-[#0c4a6e] disabled:opacity-50">Create Client</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ClientsView;