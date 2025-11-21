import React, { useMemo } from 'react';
import { 
  ArrowRight, AlertCircle, Sparkles, MapPin, Clock, 
  TrendingUp, CheckCircle2, Calendar, Activity, 
  MoreHorizontal, Shield, DollarSign, Users, Briefcase, HardHat, CheckSquare, Map as MapIcon,
  FileText, PlusSquare, UserCheck, GitPullRequest, MessageSquare, FileBarChart, Settings, RotateCcw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';
import { UserRole, Task, Page } from '../types';

interface DashboardViewProps {
  setPage: (page: Page) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setPage }) => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard setPage={setPage} />;
    case UserRole.COMPANY_ADMIN:
      return <CompanyAdminDashboard setPage={setPage} />;
    case UserRole.SUPERVISOR:
      return <SupervisorDashboard setPage={setPage} />;
    case UserRole.OPERATIVE:
      return <OperativeDashboard setPage={setPage} />;
    default:
      return <OperativeDashboard setPage={setPage} />;
  }
};

// --- Quick Actions Components ---

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  onClick: () => void;
  color?: string;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ icon: Icon, title, desc, onClick, color = "text-[#0f5c82]" }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-[#0f5c82] transition-all cursor-pointer flex flex-col items-center text-center group w-full h-full"
  >
    <div className={`p-3 rounded-lg bg-zinc-50 group-hover:bg-blue-50 transition-colors mb-3 ${color}`}>
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-[#0f5c82] transition-colors">{title}</h3>
    <p className="text-xs text-zinc-500">{desc}</p>
  </button>
);

const QuickActionsGrid: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-zinc-700 font-semibold">
        <Settings size={18} className="text-[#0f5c82]" />
        <span>Quick Actions</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <QuickActionCard 
        icon={FileText} 
        title="Create Invoice" 
        desc="Generate a new invoice" 
        onClick={() => setPage(Page.FINANCIALS)} 
      />
      <QuickActionCard 
        icon={PlusSquare} 
        title="New Quote" 
        desc="Create project quote" 
        onClick={() => setPage(Page.PROJECT_LAUNCHPAD)} 
        color="text-green-600"
      />
      <QuickActionCard 
        icon={Users} 
        title="Team Management" 
        desc="Manage team & resources" 
        onClick={() => setPage(Page.TEAM)} 
        color="text-purple-600"
      />
      <QuickActionCard 
        icon={Calendar} 
        title="Schedule" 
        desc="View project timeline" 
        onClick={() => setPage(Page.SCHEDULE)} 
        color="text-orange-600"
      />
      <QuickActionCard 
        icon={Briefcase} 
        title="CRM" 
        desc="Customer relationship" 
        onClick={() => setPage(Page.CLIENTS)} 
        color="text-blue-600"
      />
      <QuickActionCard 
        icon={RotateCcw} 
        title="Variations" 
        desc="Project variations" 
        onClick={() => setPage(Page.PROJECTS)} 
        color="text-red-500"
      />
      <QuickActionCard 
        icon={MessageSquare} 
        title="AI Advisor" 
        desc="Get AI assistance" 
        onClick={() => setPage(Page.CHAT)} 
        color="text-indigo-600"
      />
      <QuickActionCard 
        icon={FileBarChart} 
        title="Reports" 
        desc="Business analytics" 
        onClick={() => setPage(Page.REPORTS)} 
        color="text-teal-600"
      />
    </div>
  </div>
);

// --- 1. SUPER ADMIN DASHBOARD ---
const SuperAdminDashboard: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
  <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-4">
         <div>
            <h1 className="text-2xl font-bold text-zinc-900">Global Platform Overview</h1>
            <p className="text-zinc-500">System-wide metrics, multi-tenant health, and executive alerts.</p>
         </div>
         <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-purple-200">Super Admin View</span>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} label="Total Projects" value="142" trend="+5 this week" color="blue" />
          <StatCard icon={Users} label="Active Users" value="3,402" trend="98% active" color="green" />
          <StatCard icon={DollarSign} label="Platform Volume" value="£420M" trend="+12% YTD" color="purple" />
          <StatCard icon={Activity} label="System Health" value="99.9%" trend="All Systems Operational" color="green" />
      </div>

      <QuickActionsGrid setPage={setPage} />

      {/* High Level Risk Map Placeholder */}
      <div className="bg-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden h-64 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover"></div>
          <div className="z-10 text-center">
             <h3 className="text-xl font-bold mb-2">Global Operations Center</h3>
             <p className="text-zinc-400 max-w-md mx-auto mb-6">Monitoring 14 regions. No critical infrastructure alerts detected.</p>
             <button onClick={() => setPage(Page.MAP_VIEW)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">View Global Map</button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
             <h3 className="font-bold text-zinc-900 mb-4">Tenant Growth</h3>
             <div className="h-48 flex items-end justify-between gap-2">
                 {[40, 55, 60, 75, 80, 95, 110, 125].map((h, i) => (
                    <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg transition-all hover:bg-blue-500" style={{height: `${(h/150)*100}%`}}></div>
                    </div>
                 ))}
             </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
             <h3 className="font-bold text-zinc-900 mb-4">Recent Security Events</h3>
             <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm border-b border-zinc-50 pb-2">
                    <span className="text-zinc-600">Failed Login (IP 192.168...)</span>
                    <span className="text-zinc-400 text-xs">10m ago</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-zinc-50 pb-2">
                    <span className="text-zinc-600">New Admin Created (Org: Metro)</span>
                    <span className="text-zinc-400 text-xs">1h ago</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-zinc-50 pb-2">
                    <span className="text-zinc-600">API Key Rolled</span>
                    <span className="text-zinc-400 text-xs">3h ago</span>
                 </div>
             </div>
          </div>
      </div>
  </div>
);

// --- 2. COMPANY ADMIN DASHBOARD ---
const CompanyAdminDashboard: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
  <div className="p-8 max-w-7xl mx-auto space-y-8">
     <div className="flex justify-between items-end mb-4">
         <div>
            <h1 className="text-2xl font-bold text-zinc-900">Company Overview</h1>
            <p className="text-zinc-500">Financial health, project portfolio status, and resource allocation.</p>
         </div>
         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-200">Admin View</span>
      </div>

      {/* Quick Actions - Enhanced */}
      <QuickActionsGrid setPage={setPage} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-gradient-to-br from-[#0f5c82] to-[#0c4a6e] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                  <h3 className="text-blue-200 font-medium text-sm uppercase tracking-wider mb-1">Total Revenue (YTD)</h3>
                  <div className="text-4xl font-bold mb-4">£24.5 Million</div>
                  <div className="flex gap-4">
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                          <div className="text-xs text-blue-200">Active Projects</div>
                          <div className="font-bold text-xl">12</div>
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                          <div className="text-xs text-blue-200">Win Rate</div>
                          <div className="font-bold text-xl">64%</div>
                      </div>
                  </div>
              </div>
              <Sparkles className="absolute top-0 right-0 text-white/10 w-64 h-64 -mr-10 -mt-10" />
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-4">Project Health</h3>
              <div className="flex items-center justify-center h-40 relative">
                   <div className="text-center">
                       <div className="text-3xl font-bold text-green-600">85%</div>
                       <div className="text-xs text-zinc-500">On Track</div>
                   </div>
                   <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#e4e4e7" strokeWidth="8" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="8" strokeDasharray="251" strokeDashoffset="40" strokeLinecap="round" />
                   </svg>
              </div>
          </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
             <h3 className="font-bold text-zinc-900">Active Projects</h3>
             <button onClick={() => setPage(Page.PROJECTS)} className="text-sm text-[#0f5c82] font-medium hover:underline">View All</button>
          </div>
          <table className="w-full text-left text-sm">
             <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs">
                 <tr>
                     <th className="px-6 py-3">Project Name</th>
                     <th className="px-6 py-3">Budget</th>
                     <th className="px-6 py-3">Progress</th>
                     <th className="px-6 py-3">Status</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-zinc-100">
                 {[
                     { name: 'City Centre Plaza', budget: '£12M', progress: 74, status: 'Good' },
                     { name: 'Westside Heights', budget: '£8.5M', progress: 45, status: 'At Risk' },
                     { name: 'Infrastructure Upgrade', budget: '£3.2M', progress: 12, status: 'Good' },
                 ].map((p, i) => (
                     <tr key={i} className="hover:bg-zinc-50">
                         <td className="px-6 py-4 font-medium text-zinc-900">{p.name}</td>
                         <td className="px-6 py-4 text-zinc-600">{p.budget}</td>
                         <td className="px-6 py-4">
                             <div className="w-24 bg-zinc-200 h-1.5 rounded-full">
                                 <div className={`h-full rounded-full ${p.status === 'Good' ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${p.progress}%`}}></div>
                             </div>
                         </td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Good' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{p.status}</span>
                         </td>
                     </tr>
                 ))}
             </tbody>
          </table>
      </div>
  </div>
);

// --- 3. SUPERVISOR DASHBOARD ---
const SupervisorDashboard: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  const { tasks } = useProjects();
  const { user } = useAuth();

  const myTasks = useMemo(() => {
      if (!user) return [];
      return tasks.filter(t => {
          if (t.status === 'Done') return false;
          
          // Role check
          if (t.assigneeType === 'role') {
             if (user.role === UserRole.SUPERVISOR && (t.assigneeName === 'Foreman' || t.assigneeName === 'Manager')) return true;
          }
          // User check
          if (t.assigneeType === 'user' && t.assigneeName === user.name) return true;
          return false;
      });
  }, [tasks, user]);

  return (
  <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-4">
         <div>
            <h1 className="text-2xl font-bold text-zinc-900">Site Supervisor Dashboard</h1>
            <p className="text-zinc-500">Daily site operations, crew management, and safety logs.</p>
         </div>
         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-orange-200">Field View</span>
      </div>

      {/* Simplified Quick Actions for Supervisor */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard icon={HardHat} title="Safety Incident" desc="Report incident" onClick={() => setPage(Page.SAFETY)} color="text-red-600" />
          <QuickActionCard icon={CheckSquare} title="My Tasks" desc="View assigned tasks" onClick={() => setPage(Page.TASKS)} color="text-blue-600" />
          <QuickActionCard icon={Users} title="Team" desc="View site crew" onClick={() => setPage(Page.TEAM)} color="text-green-600" />
          <QuickActionCard icon={MapIcon} title="Site Map" desc="View live map" onClick={() => setPage(Page.LIVE_PROJECT_MAP)} color="text-orange-600" />
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><HardHat size={24} /></div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">100% Check-in</span>
              </div>
              <div className="text-2xl font-bold text-zinc-900">24/24</div>
              <div className="text-sm text-zinc-500">Operatives On Site</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
               <div className="flex justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CheckSquare size={24} /></div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">{myTasks.length} Active</span>
              </div>
              <div className="text-2xl font-bold text-zinc-900">{myTasks.length} Tasks</div>
              <div className="text-sm text-zinc-500">Assigned to Me/Role</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
               <div className="flex justify-between mb-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle size={24} /></div>
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded">Last 24h</span>
              </div>
              <div className="text-2xl font-bold text-zinc-900">0 Incidents</div>
              <div className="text-sm text-zinc-500">Safety Status: Clear</div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* My Tasks / Pending Actions */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-bold text-zinc-900 mb-4">My Tasks & Approvals</h3>
              <div className="space-y-3">
                  {myTasks.length > 0 ? myTasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-zinc-50 last:border-0">
                          <div className={`mt-0.5 w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-[#0f5c82]'}`} />
                          <div className="flex-1">
                              <div className="text-sm font-medium text-zinc-900">{task.title}</div>
                              <div className="text-xs text-zinc-500 flex items-center gap-2">
                                  <span>Due: {task.dueDate}</span>
                                  {task.assigneeType === 'role' && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Role: {task.assigneeName}</span>}
                              </div>
                          </div>
                          <button onClick={() => setPage(Page.TASKS)} className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1 rounded hover:bg-zinc-200">View</button>
                      </div>
                  )) : (
                      <div className="text-zinc-400 text-sm italic">No active tasks assigned.</div>
                  )}
              </div>
          </div>
          
          {/* Active Hazards */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
               <h3 className="font-bold text-zinc-900 mb-4">Active Hazards</h3>
               <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-3 flex items-start gap-3">
                   <AlertCircle className="text-orange-600 flex-shrink-0" size={18} />
                   <div>
                       <div className="text-sm font-bold text-orange-800">High Winds Expected</div>
                       <div className="text-xs text-orange-700">Crane operations suspended after 2 PM.</div>
                   </div>
               </div>
               <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-start gap-3">
                   <MapPin className="text-zinc-400 flex-shrink-0" size={18} />
                   <div>
                       <div className="text-sm font-bold text-zinc-700">Excavation Zone B</div>
                       <div className="text-xs text-zinc-500">Requires barrier inspection.</div>
                   </div>
               </div>
          </div>
      </div>
  </div>
  );
};

// --- 4. OPERATIVE DASHBOARD ---
const OperativeDashboard: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  const { tasks } = useProjects();
  const { user } = useAuth();

  const myTasks = useMemo(() => {
      if (!user) return [];
      return tasks.filter(t => {
          if (t.status === 'Done') return false;
          
          // Role check
          if (t.assigneeType === 'role') {
             if (user.role === UserRole.OPERATIVE && t.assigneeName === 'Operative') return true;
          }
          // User check
          if (t.assigneeType === 'user' && t.assigneeName === user.name) return true;
          return false;
      });
  }, [tasks, user]);

  return (
  <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
         <h1 className="text-xl font-bold text-zinc-900">My Work Portal</h1>
         <p className="text-zinc-500">Welcome back, {user?.name.split(' ')[0]}.</p>
      </div>

      {/* Time Clock Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Current Status</div>
          <div className="text-3xl font-bold text-green-600 mb-1">Clocked In</div>
          <div className="text-zinc-500 mb-6">Since 07:30 AM</div>
          
          <div className="flex gap-4 w-full max-w-xs">
              <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100">
                 Clock Out
              </button>
              <button className="flex-1 bg-zinc-100 text-zinc-600 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                 Take Break
              </button>
          </div>
      </div>

      {/* Assigned Tasks */}
      <div>
          <h3 className="font-bold text-zinc-900 mb-4">My Tasks for Today ({myTasks.length})</h3>
          <div className="space-y-3">
              {myTasks.length > 0 ? myTasks.map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-start gap-3 group hover:border-[#0f5c82] transition-colors">
                      <button className="mt-1 w-5 h-5 rounded border-2 border-zinc-300 hover:border-[#0f5c82] flex items-center justify-center text-transparent hover:text-[#0f5c82] transition-all">
                          <CheckCircle2 size={12} />
                      </button>
                      <div className="flex-1">
                          <div className="font-medium text-zinc-900 flex justify-between">
                              <span>{task.title}</span>
                              {task.assigneeType === 'role' && (
                                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">
                                      {task.assigneeName}
                                  </span>
                              )}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                              <Clock size={12} /> Due {task.dueDate} • 
                              <span className={`${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-orange-600' : 'text-green-600'} font-medium`}>
                                  {task.priority} Priority
                              </span>
                          </div>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-8 text-zinc-400 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                      <CheckSquare size={32} className="mx-auto mb-2 opacity-20" />
                      <p>No tasks assigned to you or your role.</p>
                  </div>
              )}
          </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setPage(Page.SAFETY)} className="p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 text-left transition-colors">
              <AlertCircle className="text-red-500 mb-2" size={24} />
              <div className="font-bold text-zinc-900">Report Safety Issue</div>
          </button>
          <button onClick={() => setPage(Page.LIVE_PROJECT_MAP)} className="p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 text-left transition-colors">
              <MapIcon className="text-[#0f5c82] mb-2" size={24} />
              <div className="font-bold text-zinc-900">View Site Map</div>
          </button>
      </div>
  </div>
  );
};

// Helper Component
const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="text-2xl font-bold text-zinc-900 mb-1">{value}</div>
        <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500">{label}</div>
            <div className={`text-[10px] font-bold bg-${color}-50 text-${color}-700 px-2 py-0.5 rounded`}>{trend}</div>
        </div>
    </div>
);

export default DashboardView;