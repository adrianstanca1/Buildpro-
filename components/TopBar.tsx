import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Page } from '../types';

interface TopBarProps {
  setPage: (page: Page) => void;
}

const TopBar: React.FC<TopBarProps> = ({ setPage }) => {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <input 
          type="text" 
          placeholder="Search projects, tasks, team..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-zinc-500 hover:text-zinc-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <button 
          onClick={() => setPage(Page.PROFILE)}
          className="flex items-center gap-3 pl-4 border-l border-zinc-200 hover:bg-zinc-50 py-1 pr-2 rounded transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#0e5a8a] text-white flex items-center justify-center text-sm font-semibold">
            JA
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-zinc-900">John Anderson</div>
            <div className="text-xs text-zinc-500">Principal Admin</div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopBar;