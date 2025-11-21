import React, { useState, useMemo } from 'react';
import { Plus, Calendar, User, Users, Briefcase, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';
import { UserRole, Task } from '../types';

const TasksView: React.FC = () => {
  const { user } = useAuth();
  const { tasks, projects, addTask } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(projects[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<'High'|'Medium'|'Low'>('Medium');
  const [newTaskAssigneeType, setNewTaskAssigneeType] = useState<'user'|'role'>('user');
  const [newTaskAssigneeRole, setNewTaskAssigneeRole] = useState('Operative');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Group tasks for Kanban
  const columns = useMemo(() => {
      return [
        {
            title: 'To Do',
            items: tasks.filter(t => t.status === 'To Do')
        },
        {
            title: 'In Progress',
            items: tasks.filter(t => t.status === 'In Progress')
        },
        {
            title: 'Done',
            items: tasks.filter(t => t.status === 'Done')
        }
      ];
  }, [tasks]);

  const getProjectName = (id: string) => {
      return projects.find(p => p.id === id)?.name || 'Unknown Project';
  };

  const handleCreateTask = () => {
      if (!newTaskTitle || !newTaskProject) return;
      
      const newTask: Task = {
          id: `t-${Date.now()}`,
          title: newTaskTitle,
          projectId: newTaskProject,
          status: 'To Do',
          priority: newTaskPriority,
          assigneeType: newTaskAssigneeType,
          assigneeName: newTaskAssigneeType === 'user' ? 'Unassigned' : newTaskAssigneeRole,
          dueDate: newTaskDueDate || 'No Date'
      };
      
      addTask(newTask);
      setShowCreateModal(false);
      setNewTaskTitle('');
      setNewTaskAssigneeRole('Operative');
  };

  const canCreateTask = user && [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUPERVISOR].includes(user.role);

  return (
    <div className="p-8 max-w-full mx-auto h-full flex flex-col relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Tasks</h1>
        <p className="text-zinc-500">Manage and track all project tasks</p>
        
        {/* Role-Based Button Protection */}
        {canCreateTask && (
            <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 flex items-center gap-2 bg-[#1f7d98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#166ba1]"
            >
                <Plus size={16} /> New Task
            </button>
        )}
      </div>

      <div className="flex gap-6 border-b border-zinc-200 mb-6">
        <button className="pb-3 border-b-2 border-[#1f7d98] text-[#1f7d98] font-medium text-sm">Kanban Board</button>
        <button className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 font-medium text-sm">Calendar</button>
        <button className="pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-700 font-medium text-sm">List View</button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-[1000px] h-full">
            {columns.map((col, idx) => (
                <div key={idx} className="flex-1 flex flex-col bg-zinc-50/50 rounded-xl border border-zinc-200/50 p-4">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="font-semibold text-zinc-700">{col.title}</h3>
                        <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full text-xs font-bold">{col.items.length}</span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                        {col.items.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                                        item.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                        item.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {item.priority}
                                    </span>
                                </div>
                                <h4 className="font-medium text-zinc-900 mb-1 text-sm">{item.title}</h4>
                                <p className="text-xs text-zinc-500 mb-3">{getProjectName(item.projectId)}</p>
                                <div className="flex justify-between items-end pt-2 border-t border-zinc-50">
                                    <div className="flex items-center gap-1 text-zinc-400 text-xs">
                                        <Calendar size={12} />
                                        <span>{item.dueDate}</span>
                                    </div>
                                    
                                    {item.assigneeType === 'role' ? (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold">
                                            <Users size={10} /> {item.assigneeName}
                                        </div>
                                    ) : (
                                        <div className={`w-6 h-6 rounded-full bg-[#1f7d98] text-white flex items-center justify-center text-[10px] font-bold`}>
                                            {(item.assigneeName || 'U').substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {col.items.length === 0 && (
                            <div className="text-center text-zinc-400 text-xs py-4 italic">
                                No tasks in this stage
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-zinc-900">Create New Task</h2>
                      <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Task Title</label>
                          <input 
                            type="text" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm focus:ring-2 focus:ring-[#0f5c82] outline-none" 
                            placeholder="Enter task name..." 
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Project</label>
                          <select 
                            value={newTaskProject}
                            onChange={(e) => setNewTaskProject(e.target.value)}
                            className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm bg-white"
                          >
                              {projects.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase">Priority</label>
                              <select 
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm bg-white"
                              >
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-zinc-500 uppercase">Due Date</label>
                              <input 
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm"
                              />
                          </div>
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Assignment Type</label>
                          <div className="flex gap-2 mt-1">
                              <button 
                                onClick={() => setNewTaskAssigneeType('user')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${newTaskAssigneeType === 'user' ? 'bg-[#0f5c82] text-white' : 'bg-zinc-100 text-zinc-600'}`}
                              >
                                  <User size={14} /> Specific User
                              </button>
                              <button 
                                onClick={() => setNewTaskAssigneeType('role')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${newTaskAssigneeType === 'role' ? 'bg-[#0f5c82] text-white' : 'bg-zinc-100 text-zinc-600'}`}
                              >
                                  <Briefcase size={14} /> Role / Group
                              </button>
                          </div>
                          
                          {newTaskAssigneeType === 'role' && (
                              <div className="mt-3">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Select Role</label>
                                <select 
                                    value={newTaskAssigneeRole}
                                    onChange={(e) => setNewTaskAssigneeRole(e.target.value)}
                                    className="w-full p-2 border border-zinc-200 rounded-lg mt-1 text-sm bg-white"
                                >
                                    <option value="Operative">Operative</option>
                                    <option value="Foreman">Foreman</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Safety Officer">Safety Officer</option>
                                </select>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm font-medium">Cancel</button>
                      <button onClick={handleCreateTask} disabled={!newTaskTitle} className="flex-1 py-2 bg-[#0f5c82] text-white rounded-lg text-sm font-medium hover:bg-[#0c4a6e] disabled:opacity-50 disabled:cursor-not-allowed">Create Task</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TasksView;