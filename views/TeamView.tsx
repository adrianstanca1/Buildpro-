
import React, { useState } from 'react';
import { 
  Plus, Users, LayoutGrid, List as ListIcon, Search, Filter, 
  Phone, Mail, MapPin, Award, Star, Calendar, Briefcase, X, 
  FileText, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { TeamMember } from '../types';

const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
        'On Site': 'bg-green-100 text-green-700',
        'Off Site': 'bg-zinc-100 text-zinc-600',
        'On Break': 'bg-blue-100 text-blue-700',
        'Leave': 'bg-orange-100 text-orange-700'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${colors[status as keyof typeof colors] || 'bg-zinc-100'}`}>
            {status}
        </span>
    );
};

const UserCard: React.FC<{ member: TeamMember; onClick: () => void }> = ({ member, onClick }) => (
    <div onClick={onClick} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${member.status === 'On Site' ? 'bg-green-500' : 'bg-zinc-300'}`} />
        
        <div className="flex justify-between items-start mb-4 pl-2">
            <div className={`w-12 h-12 rounded-full ${member.color} text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
                {member.initials}
            </div>
            <StatusBadge status={member.status} />
        </div>
        
        <div className="pl-2">
            <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-[#0f5c82] transition-colors">{member.name}</h3>
            <p className="text-sm text-zinc-500 mb-4">{member.role}</p>
            
            <div className="space-y-2 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-zinc-400" />
                    <span className="truncate">{member.projectName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-zinc-400" />
                    <span>{member.phone}</span>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-50 pl-2 flex gap-2">
            {member.certifications && member.certifications.length > 0 && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                    <Award size={12} /> {member.certifications.length} Certs
                </span>
            )}
            {member.performanceRating && (
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
                    <Star size={12} /> {member.performanceRating}%
                </span>
            )}
        </div>
    </div>
);

const TeamView: React.FC = () => {
  const { teamMembers, isLoading } = useProjects();
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative h-full flex flex-col">
       {/* Header */}
       <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-3">
               <Users className="text-[#0f5c82]" /> Team Management
            </h1>
            <p className="text-zinc-500">Manage your workforce, track qualifications, and view assignments.</p>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="bg-zinc-100 p-1 rounded-lg flex border border-zinc-200">
                  <button 
                    onClick={() => setViewMode('GRID')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-white shadow-sm text-[#0f5c82]' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('LIST')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-[#0f5c82]' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                      <ListIcon size={18} />
                  </button>
              </div>
              <button className="flex items-center gap-2 bg-[#0f5c82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0c4a6e] shadow-sm transition-all">
                  <Plus size={18} /> Add Member
              </button>
          </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, role, or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f5c82] focus:border-transparent outline-none transition-all"
              />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex-1 md:flex-none justify-center">
                  <Filter size={16} /> Role
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex-1 md:flex-none justify-center">
                  <Award size={16} /> Certifications
              </button>
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
          {viewMode === 'GRID' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMembers.map(member => (
                      <UserCard key={member.id} member={member} onClick={() => setSelectedMember(member)} />
                  ))}
              </div>
          ) : (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-zinc-500 uppercase text-xs font-medium border-b border-zinc-200">
                          <tr>
                              <th className="px-6 py-4">Name</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Project</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                          {filteredMembers.map(member => (
                              <tr key={member.id} className="hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className={`w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-bold`}>{member.initials}</div>
                                          <span className="font-medium text-zinc-900">{member.name}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-zinc-600">{member.role}</td>
                                  <td className="px-6 py-4">
                                      <StatusBadge status={member.status} />
                                  </td>
                                  <td className="px-6 py-4 text-zinc-600 truncate max-w-[200px]">{member.projectName || '-'}</td>
                                  <td className="px-6 py-4 text-zinc-500 text-xs font-mono">{member.phone}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-[#0f5c82] hover:underline font-medium text-xs">View</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>

      {/* Slide-over Details Panel */}
      {selectedMember && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end transition-opacity" onClick={() => setSelectedMember(null)}>
              <div 
                className="w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                  <div className="relative">
                      <button 
                        onClick={() => setSelectedMember(null)}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
                      >
                          <X size={20} />
                      </button>
                      
                      {/* Header Banner */}
                      <div className="h-32 bg-gradient-to-r from-[#0f5c82] to-[#1e3a8a]"></div>
                      
                      <div className="px-8 -mt-12 mb-6">
                          <div className="flex justify-between items-end">
                              <div className={`w-24 h-24 rounded-2xl ${selectedMember.color} text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg`}>
                                  {selectedMember.initials}
                              </div>
                              <div className="flex gap-3 mb-1">
                                  <button className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600"><Phone size={18} /></button>
                                  <button className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600"><Mail size={18} /></button>
                                  <button className="px-4 py-2 bg-[#0f5c82] text-white rounded-lg font-medium text-sm hover:bg-[#0c4a6e]">Edit Profile</button>
                              </div>
                          </div>
                          
                          <div className="mt-4">
                              <h2 className="text-2xl font-bold text-zinc-900">{selectedMember.name}</h2>
                              <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                                  <span>{selectedMember.role}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedMember.location || 'London, UK'}</span>
                              </div>
                          </div>
                      </div>

                      <div className="px-8 space-y-8 pb-8">
                          {/* Status & Allocation */}
                          <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                  <div className="text-xs font-bold text-zinc-400 uppercase mb-1">Current Status</div>
                                  <StatusBadge status={selectedMember.status} />
                              </div>
                              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                  <div className="text-xs font-bold text-zinc-400 uppercase mb-1">Assigned Project</div>
                                  <div className="font-semibold text-zinc-900 truncate" title={selectedMember.projectName}>
                                      {selectedMember.projectName || 'Unassigned'}
                                  </div>
                              </div>
                          </div>

                          {/* Bio */}
                          {selectedMember.bio && (
                              <div>
                                  <h3 className="font-bold text-zinc-900 mb-2">About</h3>
                                  <p className="text-zinc-600 text-sm leading-relaxed">{selectedMember.bio}</p>
                              </div>
                          )}

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 border border-zinc-100 rounded-xl shadow-sm">
                                  <div className="text-2xl font-bold text-[#0f5c82]">{selectedMember.completedProjects || 0}</div>
                                  <div className="text-xs text-zinc-500 uppercase mt-1">Projects</div>
                              </div>
                              <div className="text-center p-4 border border-zinc-100 rounded-xl shadow-sm">
                                  <div className="text-2xl font-bold text-[#0f5c82]">{selectedMember.performanceRating || '-'}<span className="text-sm text-zinc-400 font-normal">/100</span></div>
                                  <div className="text-xs text-zinc-500 uppercase mt-1">Rating</div>
                              </div>
                              <div className="text-center p-4 border border-zinc-100 rounded-xl shadow-sm">
                                  <div className="text-2xl font-bold text-[#0f5c82]">£{selectedMember.hourlyRate || '45'}</div>
                                  <div className="text-xs text-zinc-500 uppercase mt-1">Hourly</div>
                              </div>
                          </div>

                          {/* Certifications */}
                          {selectedMember.certifications && selectedMember.certifications.length > 0 && (
                              <div>
                                  <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Award size={18} className="text-orange-500" /> Certifications</h3>
                                  <div className="space-y-3">
                                      {selectedMember.certifications.map((cert, i) => (
                                          <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                              <div className="flex items-center gap-3">
                                                  <div className="p-2 bg-white rounded-md shadow-sm text-blue-600"><FileText size={16} /></div>
                                                  <div>
                                                      <div className="text-sm font-bold text-zinc-800">{cert.name}</div>
                                                      <div className="text-xs text-zinc-500">{cert.issuer}</div>
                                                  </div>
                                              </div>
                                              <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${cert.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                  {cert.status}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeamView;
