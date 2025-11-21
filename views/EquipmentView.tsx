import React from 'react';
import { Plus, Wrench } from 'lucide-react';

const EquipmentView: React.FC = () => {
  const equipment = [
    { name: 'Excavator CAT 320', type: 'Heavy Machinery', status: 'In Use', project: 'City Centre Plaza Development', last: '2025-10-15', next: '2025-12-15', statusColor: 'bg-orange-100 text-orange-700' },
    { name: 'Concrete Mixer', type: 'Utility Equipment', status: 'Available', project: '-', last: '2025-09-20', next: '2025-11-20', statusColor: 'bg-green-100 text-green-700' },
    { name: 'Tower Crane', type: 'Heavy Machinery', status: 'In Use', project: 'City Centre Plaza Development', last: '2025-10-01', next: '2025-12-01', statusColor: 'bg-orange-100 text-orange-700' },
    { name: 'Forklift - 5 Ton', type: 'Heavy Machinery', status: 'Available', project: '-', last: '2025-10-10', next: '2025-12-10', statusColor: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Equipment Management</h1>
        <p className="text-zinc-500">Track and manage construction equipment</p>
        <button className="mt-4 flex items-center gap-2 bg-[#1f7d98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#166ba1]">
            <Plus size={16} /> Add Equipment
        </button>
      </div>

      <div className="flex gap-3 mb-6">
         <button className="px-3 py-1 border border-zinc-200 rounded text-xs bg-white">All Equipment ↕</button>
         <button className="px-3 py-1 border border-zinc-200 rounded text-xs bg-white">All Types ↕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                          <div className="text-sm text-zinc-500">{item.type}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.statusColor}`}>
                          {item.status}
                      </span>
                  </div>

                  <div className="space-y-3 text-sm mb-6">
                      <div>
                          <div className="text-zinc-900 font-medium">Project: {item.project}</div>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-zinc-600 font-medium">Last Service: <span className="font-normal text-zinc-500">{item.last}</span></span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-zinc-600 font-medium">Next Service: <span className="font-normal text-zinc-500">{item.next}</span></span>
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <button className="px-4 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded text-xs font-medium hover:bg-zinc-100 flex items-center gap-1">
                          <Wrench size={12} /> Assign
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default EquipmentView;