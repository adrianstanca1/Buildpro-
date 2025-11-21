
import React from 'react';
import { Plus, ArrowUpDown, Calendar, PoundSterling, Users, AlertTriangle, MapPin, ArrowRight, Rocket } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { Page } from '../types';

interface ProjectsViewProps {
  onProjectSelect?: (id: string) => void;
  setPage: (page: Page) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ onProjectSelect, setPage }) => {
  const { projects } = useProjects();

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Project Portfolio</h1>
          <p className="text-zinc-500">Overview of all {projects.length} active sites and developments</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setPage(Page.PROJECT_LAUNCHPAD)}
                className="flex items-center gap-2 bg-[#0f5c82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0c4a6e] shadow-sm transition-all hover:shadow-md group"
            >
                <Rocket size={18} className="group-hover:animate-bounce" /> Launch New Project
            </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
         <button className="px-4 py-1.5 border border-zinc-200 rounded-full text-sm bg-zinc-900 text-white font-medium flex items-center gap-1">All Projects <ArrowUpDown size={12} /></button>
         <button className="px-4 py-1.5 border border-zinc-200 rounded-full text-sm bg-white hover:bg-zinc-50 flex items-center gap-1">Commercial</button>
         <button className="px-4 py-1.5 border border-zinc-200 rounded-full text-sm bg-white hover:bg-zinc-50 flex items-center gap-1">Residential</button>
         <button className="px-4 py-1.5 border border-zinc-200 rounded-full text-sm bg-white hover:bg-zinc-50 flex items-center gap-1">Infrastructure</button>
         <button className="px-4 py-1.5 border border-zinc-200 rounded-full text-sm bg-white hover:bg-zinc-50 flex items-center gap-1">Planning</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        {projects.map((project) => (
            <div 
                key={project.id} 
                onClick={() => onProjectSelect && onProjectSelect(project.id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onProjectSelect && onProjectSelect(project.id);
                    }
                }}
                role="button"
                tabIndex={0}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col focus:ring-4 focus:ring-[#0f5c82]/20 focus:outline-none focus:border-[#0f5c82]"
            >
                {/* Image Header */}
                <div className="h-56 w-full relative overflow-hidden">
                    <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md ${
                            project.status === 'Active' ? 'bg-green-500/80 text-white' : 'bg-zinc-500/80 text-white'
                        }`}>
                            {project.status}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold leading-tight mb-1">{project.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-zinc-200">
                            <MapPin size={14} /> {project.location}
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="space-y-1">
                            <div className="text-xs text-zinc-500 uppercase font-semibold">Timeline</div>
                            <div className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#0f5c82]" />
                                {new Date(project.endDate).toLocaleDateString(undefined, {month: 'short', year: '2-digit'})}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-zinc-500 uppercase font-semibold">Budget</div>
                            <div className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
                                <PoundSterling size={14} className="text-green-600" />
                                {formatCurrency(project.budget)}
                            </div>
                        </div>
                        <div className="space-y-1">
                             <div className="text-xs text-zinc-500 uppercase font-semibold">Team</div>
                             <div className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
                                <Users size={14} className="text-orange-600" />
                                {project.teamSize} Members
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                         <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Progress</span>
                                <span className="text-2xl font-bold text-zinc-900">{project.progress}%</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                {project.tasks.overdue > 0 && (
                                    <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-md flex items-center gap-1">
                                        <AlertTriangle size={12} /> {project.tasks.overdue} Issues
                                    </span>
                                )}
                                <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                    project.health === 'Good' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                    {project.health} Health
                                </span>
                            </div>
                         </div>
                         <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                             <div className={`h-full rounded-full transition-all duration-500 ${project.progress > 80 ? 'bg-green-500' : project.health === 'At Risk' ? 'bg-orange-500' : 'bg-[#0f5c82]'}`} style={{width: `${project.progress}%`}}></div>
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0f5c82] text-white flex items-center justify-center text-xs font-bold">
                                    +{project.teamSize - 3}
                                </div>
                            </div>
                            <button 
                                className="text-[#0f5c82] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                tabIndex={-1} // Parent is clickable, remove this from tab order
                            >
                                View Dashboard <ArrowRight size={16} />
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
