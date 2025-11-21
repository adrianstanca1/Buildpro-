import React, { useState } from 'react';
import { 
  Calendar, Filter, Plus, ChevronRight, ChevronDown, 
  MoreHorizontal, Zap, Flag, ArrowRight, Search, 
  LayoutGrid, List, Clock, User, AlertCircle, CheckCircle2
} from 'lucide-react';

const ScheduleView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'GANTT' | 'LIST'>('GANTT');
  const [showAIOptimizer, setShowAIOptimizer] = useState(false);

  // Mock Data
  const tasks = [
    { id: 1, name: 'Site Preparation & Clearing', start: 1, duration: 5, progress: 100, type: 'construction', dependencies: [], assignee: 'Team Alpha', status: 'Completed', priority: 'High' },
    { id: 2, name: 'Foundation Excavation', start: 5, duration: 8, progress: 60, type: 'construction', dependencies: [1], assignee: 'Mike Thompson', status: 'In Progress', priority: 'High' },
    { id: 3, name: 'Safety Inspection (Foundation)', start: 13, duration: 1, progress: 0, type: 'milestone', dependencies: [2], assignee: 'Safety Officer', status: 'Pending', priority: 'Critical' },
    { id: 4, name: 'Concrete Pouring - Base', start: 14, duration: 4, progress: 0, type: 'construction', dependencies: [3], assignee: 'Team Beta', status: 'Pending', priority: 'High' },
    { id: 5, name: 'Steel Reinforcement Install', start: 16, duration: 6, progress: 0, type: 'construction', dependencies: [3], assignee: 'David Chen', status: 'Pending', priority: 'Medium' },
    { id: 6, name: 'Plumbing Rough-in', start: 20, duration: 5, progress: 0, type: 'mep', dependencies: [4], assignee: 'Subcontractor A', status: 'Pending', priority: 'Medium' },
    { id: 7, name: 'Electrical Conduit Run', start: 21, duration: 4, progress: 0, type: 'mep', dependencies: [4], assignee: 'Subcontractor B', status: 'Pending', priority: 'Medium' },
  ];

  // Constants for Gantt rendering
  const dayWidth = 40;
  const headerHeight = 60;
  const rowHeight = 48;

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'bg-green-100 text-green-700';
          case 'In Progress': return 'bg-blue-100 text-blue-700';
          case 'Pending': return 'bg-zinc-100 text-zinc-600';
          default: return 'bg-zinc-100 text-zinc-600';
      }
  };

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
          case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
          case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
          default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
      }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Toolbar */}
      <div className="h-16 border-b border-zinc-200 px-6 flex items-center justify-between bg-white flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Calendar className="text-[#0f5c82]" /> Master Schedule
           </h1>
           <div className="h-6 w-px bg-zinc-200" />
           <div className="flex bg-zinc-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('GANTT')}
                className={`p-1.5 rounded flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'GANTT' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                  <LayoutGrid size={14} /> Gantt
              </button>
              <button 
                onClick={() => setViewMode('LIST')}
                className={`p-1.5 rounded flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'LIST' ? 'bg-white text-[#0f5c82] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                  <List size={14} /> List
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowAIOptimizer(!showAIOptimizer)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    showAIOptimizer 
                    ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-inner' 
                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
            >
                <Zap size={16} className={showAIOptimizer ? 'fill-purple-700' : ''} /> AI Optimizer
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#0f5c82] text-white rounded-lg text-sm font-medium hover:bg-[#0c4a6e] shadow-sm">
                <Plus size={16} /> Add Task
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Content Area */}
         {viewMode === 'GANTT' ? (
             <>
                 {/* Task List Sidebar (Left) */}
                 <div className="w-80 border-r border-zinc-200 flex flex-col bg-white z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <div className="h-[60px] border-b border-zinc-200 flex items-center px-4 bg-zinc-50 font-bold text-xs text-zinc-500 uppercase tracking-wider">
                        Task Name
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        {tasks.map((task, i) => (
                            <div 
                                key={task.id} 
                                className="h-[48px] flex items-center px-4 border-b border-zinc-50 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                            >
                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <span className="text-zinc-400 text-xs font-mono w-4">{i+1}</span>
                                    <div className={`w-2 h-2 rounded-full ${task.type === 'milestone' ? 'bg-amber-500 rotate-45' : 'bg-[#0f5c82]'}`} />
                                    <span className="text-sm font-medium text-zinc-800 truncate">{task.name}</span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-[#0f5c82]">
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Gantt Chart Area (Right) */}
                 <div className="flex-1 overflow-auto relative bg-zinc-50/50" style={{ scrollBehavior: 'smooth' }}>
                    <div className="min-w-[1200px] relative">
                        
                        {/* Timeline Header */}
                        <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 h-[60px] flex">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 border-r border-zinc-100 flex flex-col justify-end pb-2 items-center" style={{ width: dayWidth }}>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Day</span>
                                    <span className={`text-sm font-bold ${i % 7 === 0 || i % 7 === 6 ? 'text-red-400' : 'text-zinc-700'}`}>
                                        {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Lines */}
                        <div className="absolute inset-0 top-[60px] pointer-events-none flex">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className={`flex-shrink-0 border-r h-full ${i % 7 === 0 || i % 7 === 6 ? 'bg-zinc-50 border-zinc-200/50' : 'border-zinc-100'}`} style={{ width: dayWidth }} />
                            ))}
                            {/* Current Day Indicator */}
                            <div className="absolute top-0 bottom-0 border-l-2 border-red-500 z-0" style={{ left: 8 * dayWidth + (dayWidth/2) }}>
                                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
                            </div>
                        </div>

                        {/* Task Bars */}
                        <div className="relative pt-0">
                            {tasks.map((task) => (
                                <div key={task.id} className="relative group" style={{ height: rowHeight }}>
                                    {/* Bar */}
                                    <div 
                                        className={`absolute top-1/2 -translate-y-1/2 rounded-md shadow-sm border border-white/20 flex items-center px-2 overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                                            task.type === 'milestone' ? 'bg-amber-500 w-6 h-6 rotate-45 rounded-sm' : 
                                            task.type === 'mep' ? 'bg-purple-500 h-7' :
                                            'bg-[#0f5c82] h-7'
                                        }`}
                                        style={{ 
                                            left: (task.start - 1) * dayWidth, 
                                            width: task.type === 'milestone' ? 24 : task.duration * dayWidth 
                                        }}
                                    >
                                        {task.type !== 'milestone' && (
                                            <>
                                                {/* Progress Fill */}
                                                <div className="absolute top-0 left-0 bottom-0 bg-black/20" style={{ width: `${task.progress}%` }} />
                                                <span className="relative text-[10px] font-bold text-white truncate px-1 drop-shadow-md">
                                                    {task.progress}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             </>
         ) : (
             <div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
                 <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-xs">
                             <tr>
                                 <th className="px-6 py-4 font-bold">Task Name</th>
                                 <th className="px-6 py-4 font-bold">Assignee</th>
                                 <th className="px-6 py-4 font-bold">Status</th>
                                 <th className="px-6 py-4 font-bold">Priority</th>
                                 <th className="px-6 py-4 font-bold">Start Day</th>
                                 <th className="px-6 py-4 font-bold">Duration</th>
                                 <th className="px-6 py-4 font-bold">Dependencies</th>
                                 <th className="px-6 py-4 font-bold text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-zinc-100">
                             {tasks.map((task) => (
                                 <tr key={task.id} className="hover:bg-zinc-50/50 transition-colors group">
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-3">
                                             {task.type === 'milestone' ? (
                                                 <div className="w-3 h-3 bg-amber-500 rotate-45 rounded-[1px]" />
                                             ) : (
                                                 <div className="w-4 h-4 border-2 border-zinc-300 rounded-full" />
                                             )}
                                             <span className="font-medium text-zinc-900">{task.name}</span>
                                         </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-2 text-zinc-600">
                                             <User size={14} /> {task.assignee}
                                         </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                             {task.status}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                                              {task.priority}
                                          </span>
                                     </td>
                                     <td className="px-6 py-4 text-zinc-600">
                                         Day {task.start}
                                     </td>
                                     <td className="px-6 py-4 text-zinc-600">
                                         {task.duration} days
                                     </td>
                                     <td className="px-6 py-4 text-zinc-500 text-xs">
                                         {task.dependencies.length > 0 ? task.dependencies.join(', ') : '-'}
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <button className="text-zinc-400 hover:text-[#0f5c82]">
                                             <MoreHorizontal size={16} />
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         )}

         {/* AI Optimizer Sidebar */}
         {showAIOptimizer && (
             <div className="w-80 bg-white border-l border-zinc-200 shadow-xl z-30 flex flex-col animate-in slide-in-from-right">
                 <div className="p-4 border-b border-zinc-200 bg-purple-50 flex justify-between items-center">
                     <h3 className="font-bold text-purple-900 flex items-center gap-2">
                         <Zap size={18} className="fill-purple-700 text-purple-700" /> Schedule Optimizer
                     </h3>
                     <button onClick={() => setShowAIOptimizer(false)} className="text-purple-700 hover:bg-purple-100 rounded p-1">
                         <ArrowRight size={16} />
                     </button>
                 </div>
                 
                 <div className="flex-1 p-4 overflow-y-auto space-y-4">
                     <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm">
                         <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Analysis Result</div>
                         <p className="text-sm text-zinc-700 leading-relaxed">
                             Based on weather forecasts and team availability, your current schedule has a <span className="font-bold text-red-600">high risk (72%)</span> of slippage in Phase 2.
                         </p>
                     </div>

                     <div>
                         <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Recommendations</div>
                         <div className="space-y-2">
                             <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm hover:bg-green-100 cursor-pointer transition-colors">
                                 <div className="font-bold text-green-800 mb-1">Shift Concrete Pour</div>
                                 <p className="text-green-700 text-xs">Move "Concrete Pouring - Base" to Day 12 to avoid predicted rain.</p>
                             </div>
                             <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm hover:bg-blue-100 cursor-pointer transition-colors">
                                 <div className="font-bold text-blue-800 mb-1">Parallelize MEP</div>
                                 <p className="text-blue-700 text-xs">Run Plumbing and Electrical concurrently to save 3 days.</p>
                             </div>
                         </div>
                     </div>

                     <div className="pt-4 border-t border-zinc-100">
                         <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 shadow-sm">
                             Apply Top Recommendations
                         </button>
                     </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default ScheduleView;