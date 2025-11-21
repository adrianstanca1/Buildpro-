import React from 'react';
import { Briefcase, Shield, List, DollarSign, Users, Wrench, Filter, Calculator, FileDown, Eye } from 'lucide-react';

const ReportsView = () => {
  const templates = [
    { icon: Briefcase, title: 'Executive Summary', desc: 'Portfolio overview, KPIs, forecast' },
    { icon: Shield, title: 'Safety Report', desc: 'Incidents, TRIFR, compliance status' },
    { icon: List, title: 'Project Progress', desc: 'Timeline, budget, milestones' },
    { icon: DollarSign, title: 'Financial Closeout', desc: 'Cost breakdown, profit, variance' },
    { icon: Users, title: 'Team Performance', desc: 'KPIs, utilization, productivity' },
    { icon: Wrench, title: 'Equipment Utilization', desc: 'ROI, maintenance, availability' },
  ];

  const scheduled = [
    { name: 'Weekly Safety Summary', schedule: 'Every Monday 8AM', recipients: '3 recipients', lastRun: '2025-11-04' },
    { name: 'Monthly Financial', schedule: '1st of month', recipients: '5 recipients', lastRun: '2025-11-01' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Custom Report Builder</h1>
        <p className="text-zinc-500">Drag-and-drop designer, pre-built templates, scheduled delivery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {templates.map((t) => (
          <div key={t.title} className="bg-white border border-zinc-200 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 text-zinc-700">
              <t.icon size={20} />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1">{t.title}</h3>
            <p className="text-sm text-zinc-500">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Report Designer */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-800">Report Designer</h3>
            <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded text-sm text-zinc-600 hover:bg-zinc-50">
                    <Filter size={14} /> Add Filter
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 rounded text-sm text-zinc-600 hover:bg-zinc-50">
                    <Calculator size={14} /> Calculated Field
                </button>
                <button className="flex items-center gap-1 px-4 py-1.5 bg-[#1f7d98] text-white rounded text-sm font-medium hover:bg-[#166ba1]">
                    <FileDown size={14} /> Generate Report
                </button>
            </div>
         </div>
         <div className="bg-[#f0f9ff] border border-dashed border-[#bae6fd] rounded-lg p-8 text-center">
            <p className="text-zinc-600 text-sm">Drag-and-drop interface for custom report creation. Add charts, tables, KPIs, and text. Export to PDF, Excel, CSV, or PowerPoint.</p>
            <div className="flex justify-center gap-3 mt-4">
                 <button className="px-3 py-1 bg-white border border-[#bae6fd] text-[#0c4a6e] text-xs rounded shadow-sm hover:bg-[#bae6fd]/20">Schedule Delivery</button>
                 <button className="px-3 py-1 bg-white border border-[#bae6fd] text-[#0c4a6e] text-xs rounded shadow-sm hover:bg-[#bae6fd]/20">Email Report</button>
            </div>
         </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <h3 className="font-semibold text-zinc-800 mb-6">Scheduled Reports & Audit Trail</h3>
        <table className="w-full text-sm text-left">
            <thead>
                <tr className="text-zinc-400 border-b border-zinc-100">
                    <th className="pb-3 font-medium uppercase text-xs">Report Name</th>
                    <th className="pb-3 font-medium uppercase text-xs">Schedule</th>
                    <th className="pb-3 font-medium uppercase text-xs">Recipients</th>
                    <th className="pb-3 font-medium uppercase text-xs">Last Run</th>
                    <th className="pb-3 font-medium uppercase text-xs text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="text-zinc-600">
                {scheduled.map((item) => (
                    <tr key={item.name} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                        <td className="py-4 text-zinc-800 font-medium">{item.name}</td>
                        <td className="py-4">{item.schedule}</td>
                        <td className="py-4">{item.recipients}</td>
                        <td className="py-4">{item.lastRun}</td>
                        <td className="py-4 text-right">
                            <button className="text-zinc-400 hover:text-[#0f5c82]">
                                <Eye size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;