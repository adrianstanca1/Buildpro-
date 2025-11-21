
import React from 'react';
import { useProjects } from '../contexts/ProjectContext';
import { AlertTriangle, Award, Calendar, CheckCircle2, Briefcase, Loader2 } from 'lucide-react';

const WorkforceView: React.FC = () => {
  const { teamMembers, isLoading } = useProjects();

  // --- Derived Stats ---
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'On Site').length;
  const utilizationRate = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
  
  // Skill Gaps (Mock logic for simulation)
  const allSkills = teamMembers.flatMap(m => m.skills || []);
  const uniqueSkills = Array.from(new Set(allSkills)) as string[];
  const skillCounts = uniqueSkills.reduce((acc, skill) => {
      acc[skill] = allSkills.filter(s => s === skill).length;
      return acc;
  }, {} as Record<string, number>);
  
  // Identify "Low Supply" skills (less than 2 people have it)
  const skillGaps = Object.entries(skillCounts).filter(([_, count]) => count < 2).map(([skill]) => skill);

  // Expiring Certifications
  const expiringCerts = teamMembers.flatMap(m => 
      (m.certifications || [])
        .filter(c => c.status === 'Expiring' || c.status === 'Expired')
        .map(c => ({ member: m.name, cert: c.name, date: c.expiryDate, status: c.status }))
  );

  if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Workforce Analytics</h1>
        <p className="text-zinc-500">Real-time insights into team capacity, skills, and compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className={`text-3xl font-bold mb-1 ${utilizationRate > 80 ? 'text-green-600' : 'text-zinc-900'}`}>{utilizationRate}%</div>
              <div className="text-xs text-zinc-500 uppercase font-bold">Current Utilization</div>
              <div className="text-xs text-zinc-400 mt-2">{activeMembers} of {totalMembers} active</div>
          </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="text-zinc-900 text-3xl font-bold mb-1">{skillGaps.length}</div>
              <div className="text-xs text-zinc-500 uppercase font-bold">Skill Gaps Identified</div>
              <div className="text-xs text-red-500 mt-2 font-medium">Critical: {skillGaps.slice(0, 2).join(', ')}</div>
          </div>
           <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="text-zinc-900 text-3xl font-bold mb-1">{expiringCerts.length}</div>
              <div className="text-xs text-zinc-500 uppercase font-bold">Compliance Risks</div>
              <div className="text-xs text-orange-500 mt-2 font-medium">Expiring Certifications</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Matrix */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-zinc-800 mb-6 flex items-center gap-2"><Award className="text-[#0f5c82]" size={20} /> Skill Matrix</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {uniqueSkills.map(skill => (
                      <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm text-zinc-600 font-medium">{skill}</span>
                          <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${skillCounts[skill] < 2 ? 'bg-red-400' : 'bg-blue-500'}`} 
                                    style={{ width: `${Math.min(100, (skillCounts[skill] / totalMembers) * 100 * 3)}%` }} 
                                  />
                              </div>
                              <span className="text-xs font-bold text-zinc-700 w-6 text-right">{skillCounts[skill]}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Expiring Certs */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="font-bold text-zinc-800 mb-6 flex items-center gap-2"><AlertTriangle className="text-orange-500" size={20} /> Expiring Qualifications</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {expiringCerts.length > 0 ? expiringCerts.map((item, i) => (
                      <div key={i} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-start justify-between group hover:border-zinc-300 transition-colors">
                          <div>
                              <div className="font-bold text-zinc-800 text-sm">{item.member}</div>
                              <div className="text-xs text-zinc-500">{item.cert}</div>
                          </div>
                          <div className="text-right">
                              <div className={`text-xs font-bold uppercase px-2 py-0.5 rounded mb-1 inline-block ${item.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {item.status}
                              </div>
                              <div className="text-[10px] text-zinc-400 font-mono">{item.date}</div>
                          </div>
                      </div>
                  )) : (
                      <div className="text-center text-zinc-400 py-10 italic">All certifications are valid.</div>
                  )}
              </div>
          </div>
      </div>

      {/* Capacity Planning */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 mt-8 shadow-sm">
           <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-zinc-800 flex items-center gap-2"><Calendar className="text-green-600" size={20} /> Project Allocation</h3>
               <button className="text-xs font-bold text-[#0f5c82] hover:underline">View Full Schedule</button>
           </div>
           <div className="space-y-4">
               {teamMembers.slice(0, 5).map(member => (
                   <div key={member.id} className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-bold`}>
                           {member.initials}
                       </div>
                       <div className="w-32 text-sm font-medium text-zinc-900 truncate">{member.name}</div>
                       <div className="flex-1 h-8 bg-zinc-50 rounded-lg relative overflow-hidden border border-zinc-100 flex">
                           {/* Simulated Gantt Bar */}
                           <div className="w-[30%] bg-transparent border-r border-zinc-200"></div>
                           <div className="flex-1 bg-blue-100 border border-blue-200 rounded m-1 flex items-center justify-center text-[10px] text-blue-800 font-medium truncate px-2">
                               {member.projectName || 'Available'}
                           </div>
                           <div className="w-[20%] bg-transparent border-l border-zinc-200"></div>
                       </div>
                   </div>
               ))}
           </div>
      </div>
    </div>
  );
};

export default WorkforceView;
