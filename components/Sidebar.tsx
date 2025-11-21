
import React from 'react';
import { 
  Briefcase, Bot, LayoutDashboard, FolderOpen, CheckSquare, Users, Clock, FileText, 
  Shield, Wrench, PoundSterling, MessageSquare, Map, Cpu, LineChart, 
  ClipboardCheck, ShoppingCart, UserCheck, Package, Calendar, PieChart, FileBarChart, 
  HardHat, Zap, Lock, Code, Store, Wand2, Monitor, HardHat as LogoIcon, Navigation, Rocket, LogOut
} from 'lucide-react';
import { Page, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const { user, logout } = useAuth();

  const allMenuItems = [
    { id: Page.MY_DESKTOP, label: 'My Desktop', icon: Monitor, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.EXECUTIVE, label: 'Executive', icon: Briefcase, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.LIVE_PROJECT_MAP, label: 'Live Project Map', icon: Navigation, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.PROJECT_LAUNCHPAD, label: 'Project Launchpad', icon: Rocket, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.CHAT, label: 'AI Assistant', icon: Bot, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.IMAGINE, label: 'Imagine Studio', icon: Wand2, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.PROJECTS, label: 'Projects', icon: FolderOpen, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.TASKS, label: 'Tasks', icon: CheckSquare, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.TEAM, label: 'Team', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.TIMESHEETS, label: 'Timesheets', icon: Clock, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.DOCUMENTS, label: 'Documents', icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.SAFETY, label: 'Safety', icon: Shield, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.EQUIPMENT, label: 'Equipment', icon: Wrench, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.FINANCIALS, label: 'Financials', icon: PoundSterling, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.TEAM_CHAT, label: 'Chat', icon: MessageSquare, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR, UserRole.OPERATIVE] },
    { id: Page.MAP_VIEW, label: 'Global Map', icon: Map, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.AI_TOOLS, label: 'AI Tools', icon: Cpu, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.ML_INSIGHTS, label: 'ML Insights', icon: LineChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.COMPLIANCE, label: 'Compliance', icon: ClipboardCheck, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.PROCUREMENT, label: 'Procurement', icon: ShoppingCart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.CLIENTS, label: 'Clients', icon: UserCheck, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.INVENTORY, label: 'Inventory', icon: Package, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.SCHEDULE, label: 'Schedule', icon: Calendar, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.CUSTOM_DASH, label: 'Custom Dash', icon: PieChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.REPORTS, label: 'Reports', icon: FileBarChart, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR] },
    { id: Page.WORKFORCE, label: 'Workforce', icon: HardHat, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
    { id: Page.INTEGRATIONS, label: 'Integrations', icon: Zap, roles: [UserRole.SUPER_ADMIN] },
    { id: Page.SECURITY, label: 'Security', icon: Lock, roles: [UserRole.SUPER_ADMIN] },
    { id: Page.DEV_SANDBOX, label: 'Dev Sandbox', icon: Code, roles: [UserRole.SUPER_ADMIN] },
    { id: Page.MARKETPLACE, label: 'Marketplace', icon: Store, roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN] },
  ];

  // Filter items based on user role
  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="w-64 h-screen bg-white border-r border-zinc-200 flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 sticky top-0 bg-white z-10 border-b border-zinc-100">
        <div className="text-[#166ba1]">
            <LogoIcon size={28} strokeWidth={2.5} fill="#166ba1" className="text-white" />
        </div>
        <span className="font-bold text-xl text-[#166ba1] tracking-tight">
          BuildPro
        </span>
      </div>

      {/* User Role Badge */}
      {user && (
        <div className="px-6 py-2">
           <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-500 px-2 py-1 rounded border border-zinc-200 tracking-wider">
              {user.role.replace('_', ' ')}
           </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-0 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          
          const onClick = () => {
             setPage(item.id as Page);
          };

          return (
            <button
              key={item.label}
              onClick={onClick}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-[#0e5a8a] bg-blue-50/80'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0e5a8a]" />
              )}
              <item.icon size={18} strokeWidth={2} className={isActive ? 'text-[#0e5a8a]' : 'text-zinc-500'} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <div className="my-4 border-t border-zinc-100 mx-6" />
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
           <LogOut size={18} strokeWidth={2} />
           <span>Log Out</span>
        </button>

      </nav>
    </div>
  );
};

export default Sidebar;
