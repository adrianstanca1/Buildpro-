import React from 'react';
import { Key, Link } from 'lucide-react';

const IntegrationsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Integrations</h1>
        <p className="text-zinc-500">Connect with third-party tools, APIs & webhooks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Procore */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-zinc-800 text-lg">Procore</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">Connected</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Last Sync: 2025-11-09 18:30</p>
              <button className="w-full bg-zinc-100 text-zinc-600 py-2 rounded text-sm font-medium hover:bg-zinc-200">Disconnect</button>
          </div>

           {/* QuickBooks */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-zinc-800 text-lg">QuickBooks</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">Connected</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Last Sync: 2025-11-10 00:00</p>
              <button className="w-full bg-zinc-100 text-zinc-600 py-2 rounded text-sm font-medium hover:bg-zinc-200">Disconnect</button>
          </div>

           {/* AutoCAD */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-zinc-800 text-lg">AutoCAD</h3>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">Disconnected</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Last Sync: Never</p>
              <button className="w-full bg-[#1f7d98] text-white py-2 rounded text-sm font-medium hover:bg-[#166ba1]">Connect</button>
          </div>

           {/* Slack */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-zinc-800 text-lg">Slack</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">Connected</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Last Sync: 2025-11-10 08:15</p>
              <button className="w-full bg-zinc-100 text-zinc-600 py-2 rounded text-sm font-medium hover:bg-zinc-200">Disconnect</button>
          </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-zinc-800 mb-4">API & Webhook System</h3>
          <p className="text-sm text-zinc-600 mb-6">RESTful API for data access. Configure webhooks for event-driven automation.</p>
          <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-200">
                  <Key size={14} /> Generate API Key
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium hover:bg-zinc-200">
                  <Link size={14} /> Configure Webhooks
              </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#1f7d98] text-white rounded-md text-xs font-medium hover:bg-[#166ba1]">
                  View API Docs
              </button>
          </div>
      </div>

       <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="font-semibold text-zinc-800 mb-4">Available Webhook Events</h3>
          <ul className="space-y-2 text-sm text-zinc-500 list-disc list-inside">
              <li>task.created, task.completed</li>
              <li>timesheet.submitted, timesheet.approved</li>
              <li>safety.incident.reported</li>
              <li>budget.threshold.exceeded</li>
              <li>equipment.maintenance.due</li>
          </ul>
      </div>
    </div>
  );
};

export default IntegrationsView;