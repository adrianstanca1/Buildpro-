import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Project, Task, TeamMember, ProjectDocument, UserRole, Client, InventoryItem, Zone } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../services/db';

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  documents: ProjectDocument[];
  clients: Client[];
  inventory: InventoryItem[];
  isLoading: boolean;
  
  // Project CRUD
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addZone: (projectId: string, zone: Zone) => void;

  // Task CRUD
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  
  // Team CRUD
  addTeamMember: (member: TeamMember) => void;
  
  // Document CRUD
  addDocument: (doc: ProjectDocument) => void;

  // Client CRUD
  addClient: (client: Client) => void;
  
  // Inventory CRUD
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, addProjectId } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [p, t, tm, d, c, i] = await Promise.all([
          db.getProjects(),
          db.getTasks(),
          db.getTeam(),
          db.getDocuments(),
          db.getClients(),
          db.getInventory()
        ]);
        setProjects(p);
        setTasks(t);
        setTeamMembers(tm);
        setDocuments(d);
        setClients(c);
        setInventory(i);
      } catch (e) {
        console.error("Failed to load data from DB", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- RBAC Filtering ---
  const visibleProjects = useMemo(() => {
      if (!user) return [];
      if (user.role === UserRole.SUPER_ADMIN || (user.projectIds && user.projectIds.includes('ALL'))) {
          return projects;
      }
      return projects.filter(p => user.projectIds?.includes(p.id));
  }, [projects, user]);

  const visibleProjectIds = useMemo(() => visibleProjects.map(p => p.id), [visibleProjects]);

  const visibleTasks = useMemo(() => {
      return tasks.filter(t => visibleProjectIds.includes(t.projectId));
  }, [tasks, visibleProjectIds]);

  const visibleTeam = useMemo(() => {
      return teamMembers.filter(m => m.projectId && visibleProjectIds.includes(m.projectId));
  }, [teamMembers, visibleProjectIds]);

  const visibleDocs = useMemo(() => {
      return documents.filter(d => visibleProjectIds.includes(d.projectId));
  }, [documents, visibleProjectIds]);

  // --- Project Methods ---
  const addProject = async (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    if (user && user.role !== UserRole.SUPER_ADMIN && addProjectId) {
        addProjectId(project.id);
    }
    await db.addProject(project);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    await db.updateProject(id, updates);
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await db.deleteProject(id);
  };

  const getProject = (id: string) => {
    return visibleProjects.find((p) => p.id === id);
  };

  const addZone = async (projectId: string, zone: Zone) => {
      setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
              const updatedZones = [...(p.zones || []), zone];
              return { ...p, zones: updatedZones };
          }
          return p;
      }));
      
      // Persist to DB
      const project = projects.find(p => p.id === projectId);
      if (project) {
          const updatedZones = [...(project.zones || []), zone];
          await db.updateProject(projectId, { zones: updatedZones });
      }
  };

  // --- Task Methods ---
  const addTask = async (task: Task) => {
    setTasks(prev => [task, ...prev]);
    // Update Project Stats Optimistically
    setProjects(prev => prev.map(p => {
            if (p.id === task.projectId) {
                return { ...p, tasks: { ...p.tasks, total: p.tasks.total + 1 } };
            }
            return p;
    }));
    await db.addTask(task);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    await db.updateTask(id, updates);
  };

  // --- Team Methods ---
  const addTeamMember = async (member: TeamMember) => {
    setTeamMembers(prev => [member, ...prev]);
    await db.addTeamMember(member);
  };

  // --- Document Methods ---
  const addDocument = async (doc: ProjectDocument) => {
    setDocuments(prev => [doc, ...prev]);
    await db.addDocument(doc);
  };

  // --- Client Methods ---
  const addClient = async (client: Client) => {
      setClients(prev => [...prev, client]);
      await db.addClient(client);
  };

  // --- Inventory Methods ---
  const addInventoryItem = async (item: InventoryItem) => {
      setInventory(prev => [...prev, item]);
      await db.addInventoryItem(item);
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
      setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      await db.updateInventoryItem(id, updates);
  };

  return (
    <ProjectContext.Provider value={{
        projects: visibleProjects, 
        tasks: visibleTasks,       
        teamMembers: visibleTeam,  
        documents: visibleDocs,    
        clients,
        inventory,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        addZone,
        addTask,
        updateTask,
        addTeamMember,
        addDocument,
        addClient,
        addInventoryItem,
        updateInventoryItem
    }}>
      {children}
    </ProjectContext.Provider>
  );
};