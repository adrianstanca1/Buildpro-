import React from 'react';
import { Check, X, Clock } from 'lucide-react';

const TimesheetsView: React.FC = () => {
  const entries = [
    { name: 'James Wilson', project: 'Infrastructure Upgrade', date: '2025-11-08', hours: '9h', in: '08:00', out: '17:00', status: 'Pending' },
    { name: 'David Chen', project: 'Residential Complex - Phase 2', date: '2025-11-08', hours: '9h', in: '07:30', out: '16:30', status: 'Approved' },
    { name: 'Robert Garcia', project: 'City Centre Plaza Development', date: '2025-11-08', hours: '10h (+2h OT)', in: '08:00', out: '18:00', status: 'Approved' },
    { name: 'James Wilson', project: 'Infrastructure Upgrade', date: '2025-11-09', hours: '8.75h', in: '08:15', out: '17:00', status: 'Pending' },
    { name: 'Emma Johnson', project: 'Residential Complex - Phase 2', date: '2025-11-09', hours: '9.5h (+1.5h OT)', in: '08:00', out: '17:30', status: 'Pending' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Timesheets</h1>
        <p className="text-zinc-500">Track and approve employee time entries</p>
        <button className="mt-4 flex items-center gap-2 bg-[#1f7d98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#166ba1]">
            <Clock size={16} /> Clock In/Out
        </button>
      </div>

      <div className="flex gap-6 border-b border-zinc-200 mb-6">
        <button className="pb-3 border-b-2 border-[#1f7d98] text-[#1f7d98] font-medium text-sm">Pending Approval</button>
        <button className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 font-medium text-sm">Approved</button>
        <button className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 font-medium text-sm">My Timesheets</button>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
            <div key={index} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="font-semibold text-zinc-900">{entry.name}</div>
                        <div className="text-xs text-zinc-500">{entry.project}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${entry.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                        {entry.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">DATE</div>
                        <div>{entry.date}</div>
                    </div>
                    <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">HOURS</div>
                        <div className="font-medium">{entry.hours}</div>
                    </div>
                    <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">CLOCK IN</div>
                        <div className="font-mono">{entry.in}</div>
                    </div>
                    <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">CLOCK OUT</div>
                        <div className="font-mono">{entry.out}</div>
                    </div>
                </div>

                {entry.status === 'Pending' && (
                    <div className="flex gap-3">
                        <button className="flex items-center gap-1 px-4 py-1.5 bg-[#1f7d98] text-white text-xs font-medium rounded hover:bg-[#166ba1]">
                            <Check size={12} /> Approve
                        </button>
                        <button className="flex items-center gap-1 px-4 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded hover:bg-zinc-200">
                            <X size={12} /> Reject
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default TimesheetsView;