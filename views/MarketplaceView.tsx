import React, { useState } from 'react';
import { Store, Search, Check, Download, Star } from 'lucide-react';

interface MarketplaceViewProps {
  installedApps: string[];
  toggleInstall: (appName: string) => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ installedApps, toggleInstall }) => {
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Project Management', 'Design & BIM', 'Financials', 'Communication', 'Safety'];

  const apps = [
    { name: 'Procore', category: 'Project Management', desc: 'Construction management software integration for RFI and submittals.', rating: 4.9, downloads: '10k+', icon: 'P' },
    { name: 'Autodesk BIM 360', category: 'Design & BIM', desc: 'Connect your BIM workflows directly to the field.', rating: 4.8, downloads: '8.5k', icon: 'A' },
    { name: 'QuickBooks', category: 'Financials', desc: 'Sync invoices and expenses automatically.', rating: 4.7, downloads: '12k+', icon: 'Q' },
    { name: 'Bluebeam', category: 'Design & BIM', desc: 'PDF markup and collaboration tools.', rating: 4.8, downloads: '6k', icon: 'B' },
    { name: 'Slack', category: 'Communication', desc: 'Real-time team messaging notifications.', rating: 4.9, downloads: '15k+', icon: 'S' },
    { name: 'DocuSign', category: 'Financials', desc: 'Electronic signature integration for contracts.', rating: 4.6, downloads: '9k', icon: 'D' },
    { name: 'SafetyCulture', category: 'Safety', desc: 'Mobile inspection and safety checklist sync.', rating: 4.7, downloads: '5k', icon: 'SC' },
    { name: 'Oracle Primavera', category: 'Project Management', desc: 'Enterprise project portfolio management.', rating: 4.5, downloads: '3k', icon: 'O' },
  ];

  const filteredApps = category === 'All' ? apps : apps.filter(a => a.category === category);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
           <Store className="text-[#0f5c82]" /> App Marketplace
        </h1>
        <p className="text-zinc-500">Discover and install integrations to power up your workflow.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        category === cat 
                        ? 'bg-[#0f5c82] text-white' 
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
          <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search apps..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent"
              />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredApps.map((app) => {
              const isInstalled = installedApps.includes(app.name);
              return (
                  <div key={app.name} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#0f5c82] to-[#1f7d98] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                              {app.icon}
                          </div>
                          {isInstalled && <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Check size={10} /> Installed</span>}
                      </div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">{app.name}</h3>
                      <p className="text-xs text-zinc-500 mb-2">{app.category}</p>
                      <p className="text-sm text-zinc-600 mb-4 flex-1 leading-relaxed">{app.desc}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 pt-4 border-t border-zinc-50">
                          <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-current" /> {app.rating}</span>
                          <span className="flex items-center gap-1"><Download size={12} /> {app.downloads}</span>
                      </div>

                      <button 
                        onClick={() => toggleInstall(app.name)}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                            isInstalled 
                            ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200' 
                            : 'bg-[#0f5c82] text-white hover:bg-[#0c4a6e]'
                        }`}
                      >
                          {isInstalled ? 'Uninstall' : 'Install'}
                      </button>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default MarketplaceView;