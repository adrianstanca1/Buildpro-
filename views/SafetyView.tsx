import React from 'react';
import { 
  AlertTriangle, Eye, Shield, Flame, Wind, 
  CheckCircle2, AlertOctagon, Thermometer, 
  MoreVertical, FileText, Siren
} from 'lucide-react';

const SafetyView: React.FC = () => {
  const incidents = [
    { title: 'Minor cut on hand', project: 'City Centre Plaza', severity: 'Low', status: 'Resolved', date: '2025-11-05', type: 'Injury' },
    { title: 'Slip hazard identified', project: 'Res. Complex Ph2', severity: 'Medium', status: 'Open', date: 'Today', type: 'Hazard' },
    { title: 'Near miss - Crane', project: 'City Centre Plaza', severity: 'High', status: 'Investigating', date: 'Yesterday', type: 'Near Miss' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">Safety Command Center</h1>
            <p className="text-zinc-500">Real-time risk monitoring and compliance tracking.</p>
          </div>
          <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2 animate-pulse">
              <Siren size={20} /> Report Incident
          </button>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Shield size={24} /></div>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+2.4%</span>
              </div>
              <div>
                  <div className="text-3xl font-bold text-zinc-900">98.2%</div>
                  <div className="text-sm text-zinc-500 font-medium">Safety Compliance Score</div>
              </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                  <div className="p-3 bg-zinc-50 text-zinc-600 rounded-xl"><FileText size={24} /></div>
                  <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">0 Open</span>
              </div>
              <div>
                  <div className="text-3xl font-bold text-zinc-900">1,240</div>
                  <div className="text-sm text-zinc-500 font-medium">Days Injury Free</div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><AlertTriangle size={24} /></div>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Action Req</span>
              </div>
              <div>
                  <div className="text-3xl font-bold text-zinc-900">3</div>
                  <div className="text-sm text-zinc-500 font-medium">Active Hazards</div>
              </div>
          </div>

          {/* AI Prediction Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between h-40 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="flex justify-between items-start relative z-10">
                  <div className="p-3 bg-white/10 rounded-xl"><AlertOctagon size={24} className="text-red-400" /></div>
                  <span className="text-xs font-bold bg-red-500/20 border border-red-500/50 text-red-300 px-2 py-1 rounded-full">AI Forecast</span>
              </div>
              <div className="relative z-10">
                  <div className="text-2xl font-bold text-white mb-1">High Risk</div>
                  <div className="text-xs text-zinc-400 leading-tight">
                      Predicted for <span className="text-white font-bold">East Wing</span> due to high winds & crane ops today.
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Incident Log */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                  <h3 className="font-bold text-zinc-800 text-lg">Recent Incidents & Observations</h3>
                  <button className="text-sm text-[#0f5c82] font-medium hover:underline">View All Log</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-medium">
                          <tr>
                              <th className="px-6 py-3">Incident</th>
                              <th className="px-6 py-3">Project</th>
                              <th className="px-6 py-3">Severity</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                          {incidents.map((inc, i) => (
                              <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="font-bold text-zinc-900">{inc.title}</div>
                                      <div className="text-xs text-zinc-500">{inc.date} • {inc.type}</div>
                                  </td>
                                  <td className="px-6 py-4 text-zinc-600">{inc.project}</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                          inc.severity === 'High' ? 'bg-red-100 text-red-700' : 
                                          inc.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                                          'bg-blue-100 text-blue-700'
                                      }`}>
                                          {inc.severity}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                          <div className={`w-2 h-2 rounded-full ${inc.status === 'Open' ? 'bg-red-500' : inc.status === 'Investigating' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                          <span className="text-zinc-700 font-medium">{inc.status}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-zinc-400 hover:text-[#0f5c82]"><Eye size={18} /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Risk Heatmap & Conditions */}
          <div className="flex flex-col gap-6">
              {/* Site Conditions */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-zinc-800 mb-4">Live Site Conditions</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                          <Thermometer size={20} className="mx-auto text-blue-500 mb-2" />
                          <div className="text-2xl font-bold text-zinc-900">72°F</div>
                          <div className="text-xs text-zinc-500">Temperature</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                          <Wind size={20} className="mx-auto text-orange-500 mb-2" />
                          <div className="text-2xl font-bold text-zinc-900">18mph</div>
                          <div className="text-xs text-zinc-500">Wind Speed</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center col-span-2">
                           <Flame size={20} className="mx-auto text-red-500 mb-2" />
                           <div className="text-lg font-bold text-zinc-900">Moderate</div>
                           <div className="text-xs text-zinc-500">Fire Danger Level</div>
                      </div>
                  </div>
              </div>

              {/* Heatmap Widget */}
              <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-700 p-4 shadow-lg relative overflow-hidden min-h-[250px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                          <AlertOctagon size={16} className="text-orange-500" /> Risk Heatmap
                      </h3>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">Live Feed</span>
                  </div>
                  
                  <div className="flex-1 relative rounded-xl overflow-hidden border border-zinc-800">
                      {/* Simplified Map Background */}
                      <div className="absolute inset-0 bg-[#1e293b]" />
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                      
                      {/* Heat Blobs */}
                      <div className="absolute top-[30%] left-[40%] w-24 h-24 bg-red-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                      <div className="absolute top-[60%] left-[70%] w-16 h-16 bg-orange-500 rounded-full blur-xl opacity-30"></div>
                      
                      {/* Markers */}
                      <div className="absolute top-[30%] left-[40%] w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100">Crane Ops</div>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 bg-zinc-900/80 backdrop-blur-sm p-2 rounded-lg border border-zinc-700/50">
                          <div className="flex justify-between text-[10px] text-zinc-400 uppercase font-bold mb-1">
                              <span>Low Risk</span>
                              <span>High Risk</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SafetyView;