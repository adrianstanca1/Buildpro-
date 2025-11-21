import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Filter } from 'lucide-react';

const MapView: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects = [
    { id: 'p1', name: 'City Centre Plaza', lat: '40%', lng: '30%', status: 'Active', color: 'text-[#0f5c82]', manager: 'Mike Thompson', progress: 74 },
    { id: 'p2', name: 'Residential Complex', lat: '60%', lng: '60%', status: 'Active', color: 'text-red-500', manager: 'Sarah Mitchell', progress: 92 },
    { id: 'p3', name: 'Highway Bridge', lat: '25%', lng: '70%', status: 'Delayed', color: 'text-orange-500', manager: 'David Chen', progress: 45 },
    { id: 'p4', name: 'Logistics Hub', lat: '75%', lng: '20%', status: 'Planning', color: 'text-zinc-500', manager: 'John Anderson', progress: 10 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Controls */}
      <div className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shadow-sm z-10">
        <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Navigation size={20} className="text-[#0f5c82]" /> Project Map
        </h1>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                <Layers size={16} /> Satellite
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                <Filter size={16} /> Filter
            </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-[#e5e7eb] overflow-hidden">
         {/* Stylized Map Background Pattern */}
         <div className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ 
                  backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
              }}>
         </div>
         
         {/* Simulated Map Features (SVG) */}
         <svg className="absolute inset-0 w-full h-full text-zinc-300 pointer-events-none" fill="none" stroke="currentColor">
             <path d="M0,200 Q300,250 600,100 T1200,300" strokeWidth="20" strokeOpacity="0.5" />
             <path d="M800,0 Q750,300 900,600" strokeWidth="15" strokeOpacity="0.5" />
             <circle cx="40%" cy="30%" r="100" fill="white" fillOpacity="0.3" />
             <circle cx="60%" cy="60%" r="150" fill="white" fillOpacity="0.3" />
         </svg>

         {/* Map Controls */}
         <div className="absolute right-6 bottom-6 flex flex-col gap-2">
             <button className="p-2 bg-white rounded-lg shadow-md text-zinc-600 hover:text-zinc-900"><ZoomIn size={20} /></button>
             <button className="p-2 bg-white rounded-lg shadow-md text-zinc-600 hover:text-zinc-900"><ZoomOut size={20} /></button>
         </div>

         {/* Pins */}
         {projects.map((p) => (
             <div 
                key={p.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{ top: p.lat, left: p.lng }}
                onClick={() => setSelectedProject(p.id === selectedProject ? null : p.id)}
             >
                 <MapPin 
                    size={48} 
                    className={`${p.color} drop-shadow-lg transition-transform group-hover:scale-110`} 
                    fill="currentColor" 
                    stroke="white" 
                    strokeWidth={1.5}
                 />
                 
                 {/* Tooltip / Info Card */}
                 {(selectedProject === p.id) && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 z-20 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-zinc-900">{p.name}</h3>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                 p.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                 p.status === 'Delayed' ? 'bg-red-100 text-red-700' : 
                                 'bg-zinc-100 text-zinc-600'
                             }`}>{p.status}</span>
                         </div>
                         <div className="space-y-2 text-sm text-zinc-600">
                             <div className="flex justify-between">
                                 <span>Manager:</span>
                                 <span className="font-medium">{p.manager}</span>
                             </div>
                             <div>
                                 <div className="flex justify-between text-xs mb-1">
                                     <span>Progress</span>
                                     <span className="font-bold">{p.progress}%</span>
                                 </div>
                                 <div className="w-full bg-zinc-100 h-1.5 rounded-full">
                                     <div className={`h-full rounded-full ${p.status === 'Delayed' ? 'bg-red-500' : 'bg-[#0f5c82]'}`} style={{width: `${p.progress}%`}}></div>
                                 </div>
                             </div>
                         </div>
                         <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45 border-b border-r border-zinc-100"></div>
                     </div>
                 )}
             </div>
         ))}
      </div>
    </div>
  );
};

export default MapView;