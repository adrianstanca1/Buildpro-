import { Project, Task, TeamMember, ProjectDocument, Client, InventoryItem } from '../types';

// Database Configuration
const DB_NAME = 'BuildProDB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  TEAM: 'team',
  DOCUMENTS: 'documents',
  CLIENTS: 'clients',
  INVENTORY: 'inventory'
};

// Initial Data Seeds
const SEED_DATA = {
  [STORES.PROJECTS]: [
    {
      id: 'p1',
      name: 'City Centre Plaza Development',
      code: 'CCP-2025',
      description: 'A mixed-use development featuring 40 stories of office space and a luxury retail podium.',
      location: 'Downtown Metro',
      type: 'Commercial',
      status: 'Active',
      health: 'Good',
      progress: 74,
      budget: 25000000,
      spent: 18500000,
      startDate: '2025-01-15',
      endDate: '2026-12-31',
      manager: 'John Anderson',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      teamSize: 24,
      tasks: { total: 145, completed: 98, overdue: 2 },
      weatherLocation: { city: 'New York', temp: '72°', condition: 'Sunny' },
      aiAnalysis: 'Project is progressing ahead of schedule. Structural steel completion is imminent.'
    },
    {
      id: 'p2',
      name: 'Residential Complex - Phase 2',
      code: 'RCP-002',
      description: 'Three tower residential complex with 400 units and shared amenities.',
      location: 'Westside Heights',
      type: 'Residential',
      status: 'Active',
      health: 'At Risk',
      progress: 45,
      budget: 18000000,
      spent: 16500000,
      startDate: '2025-02-01',
      endDate: '2025-11-30',
      manager: 'Sarah Mitchell',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      teamSize: 18,
      tasks: { total: 200, completed: 80, overdue: 12 },
      weatherLocation: { city: 'Chicago', temp: '65°', condition: 'Windy' }
    },
    {
        id: 'p3',
        name: 'Highway Bridge Repair',
        code: 'HWY-95-REP',
        description: 'Structural reinforcement and resurfacing of the I-95 overpass.',
        location: 'Interstate 95',
        type: 'Infrastructure',
        status: 'Active',
        health: 'Good',
        progress: 12,
        budget: 3200000,
        spent: 400000,
        startDate: '2025-10-01',
        endDate: '2026-04-01',
        manager: 'David Chen',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        teamSize: 45,
        tasks: { total: 50, completed: 5, overdue: 0 },
        weatherLocation: { city: 'Austin', temp: '88°', condition: 'Clear' }
    }
  ],
  [STORES.TASKS]: [
    { id: 't1', title: 'Safety inspection - Site A', projectId: 'p1', status: 'To Do', priority: 'High', assigneeName: 'Mike T.', assigneeType: 'user', dueDate: '2025-11-12' },
    { id: 't2', title: 'Concrete pouring - Level 2', projectId: 'p1', status: 'To Do', priority: 'High', assigneeName: 'All Operatives', assigneeType: 'role', dueDate: '2025-11-20' },
    { id: 't3', title: 'Complete foundation excavation', projectId: 'p1', status: 'In Progress', priority: 'High', assigneeName: 'David C.', assigneeType: 'user', dueDate: '2025-11-15' },
    { id: 't4', title: 'Install steel framework', projectId: 'p1', status: 'Done', priority: 'High', assigneeName: 'David C.', assigneeType: 'user', dueDate: '2025-11-08' },
    { id: 't5', title: 'Quality control inspection', projectId: 'p3', status: 'To Do', priority: 'High', assigneeName: 'Tom H.', assigneeType: 'user', dueDate: '2025-11-14' }
  ],
  [STORES.TEAM]: [
    { 
      id: 'tm1', name: 'John Anderson', initials: 'JA', role: 'Principal Admin', status: 'On Site', 
      projectId: 'p1', projectName: 'City Centre Plaza Development', phone: '+44 7700 900001', color: 'bg-[#0f5c82]', email: 'john@buildcorp.com',
      bio: '20+ years in construction management. Specialized in large-scale commercial and infrastructure projects.',
      location: 'London, UK',
      skills: ['Strategic Planning', 'Budget Management', 'Stakeholder Relations'],
      certifications: [
        { name: 'PMP - Project Management Professional', issuer: 'PMI', issueDate: '2020-05-15', expiryDate: '2026-05-15', status: 'Valid' }
      ],
      performanceRating: 98, completedProjects: 42
    },
    { 
      id: 'tm3', name: 'Mike Thompson', initials: 'MT', role: 'Project Manager', status: 'On Site', 
      projectId: 'p1', projectName: 'City Centre Plaza Development', phone: '+44 7700 900003', color: 'bg-[#1f7d98]', email: 'mike@buildcorp.com',
      bio: 'Hands-on project manager with a background in civil engineering.',
      location: 'London, UK',
      skills: ['Civil Engineering', 'Site Safety', 'AutoCAD'],
      certifications: [],
      performanceRating: 88, completedProjects: 12
    }
  ],
  [STORES.DOCUMENTS]: [
    { id: 'd1', name: 'City Centre - Structural Plans', type: 'CAD', projectId: 'p1', projectName: 'City Centre Plaza', size: '12.5 MB', date: '2025-10-15', status: 'Approved' },
    { id: 'd2', name: 'Building Permit - Phase 1', type: 'Document', projectId: 'p1', projectName: 'City Centre Plaza', size: '2.3 MB', date: '2025-09-20', status: 'Approved' }
  ],
  [STORES.CLIENTS]: [
    { id: 'c1', name: 'Metro Development Group', contactPerson: 'Alice Walker', role: 'Director of Operations', email: 'alice@metrodev.com', phone: '(555) 123-4567', status: 'Active', tier: 'Gold', activeProjects: 3, totalValue: '£45.2M' }
  ],
  [STORES.INVENTORY]: [
    { id: 'INV-001', name: 'Portland Cement Type I', category: 'Raw Materials', stock: 450, unit: 'Bags', threshold: 100, status: 'In Stock', location: 'Warehouse A', lastOrderDate: '2025-10-20', costPerUnit: 12.50 }
  ]
};

class DatabaseService {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor() {
    this.dbName = DB_NAME;
    this.dbVersion = DB_VERSION;
  }

  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.seedData().then(() => resolve(this.db!));
      };

      request.onerror = (event) => {
        reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  private async seedData() {
    if (!this.db) return;
    
    // Check if projects exist to determine if seeding is needed
    const transaction = this.db.transaction([STORES.PROJECTS], 'readonly');
    const store = transaction.objectStore(STORES.PROJECTS);
    const countRequest = store.count();

    return new Promise<void>((resolve) => {
        countRequest.onsuccess = () => {
            if (countRequest.result === 0) {
                console.log("Seeding initial database...");
                const seedTransaction = this.db!.transaction(Object.values(STORES), 'readwrite');
                
                seedTransaction.oncomplete = () => {
                    console.log("Database seeding complete.");
                    resolve();
                };

                Object.entries(SEED_DATA).forEach(([storeName, items]) => {
                    const objectStore = seedTransaction.objectStore(storeName);
                    items.forEach(item => objectStore.add(item));
                });
            } else {
                resolve();
            }
        };
    });
  }

  // Generic CRUD Operations

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add<T>(storeName: string, item: T): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Specific Accessors
  async getProjects(): Promise<Project[]> { return this.getAll<Project>(STORES.PROJECTS); }
  async addProject(p: Project) { return this.add(STORES.PROJECTS, p); }
  async updateProject(id: string, p: Partial<Project>) {
      const projects = await this.getProjects();
      const existing = projects.find(x => x.id === id);
      if(existing) await this.update(STORES.PROJECTS, { ...existing, ...p });
  }
  async deleteProject(id: string) { return this.delete(STORES.PROJECTS, id); }

  async getTasks(): Promise<Task[]> { return this.getAll<Task>(STORES.TASKS); }
  async addTask(t: Task) { return this.add(STORES.TASKS, t); }
  async updateTask(id: string, t: Partial<Task>) {
      const tasks = await this.getTasks();
      const existing = tasks.find(x => x.id === id);
      if(existing) await this.update(STORES.TASKS, { ...existing, ...t });
  }

  async getTeam(): Promise<TeamMember[]> { return this.getAll<TeamMember>(STORES.TEAM); }
  async addTeamMember(m: TeamMember) { return this.add(STORES.TEAM, m); }

  async getDocuments(): Promise<ProjectDocument[]> { return this.getAll<ProjectDocument>(STORES.DOCUMENTS); }
  async addDocument(d: ProjectDocument) { return this.add(STORES.DOCUMENTS, d); }

  async getClients(): Promise<Client[]> { return this.getAll<Client>(STORES.CLIENTS); }
  async addClient(c: Client) { return this.add(STORES.CLIENTS, c); }

  async getInventory(): Promise<InventoryItem[]> { return this.getAll<InventoryItem>(STORES.INVENTORY); }
  async addInventoryItem(i: InventoryItem) { return this.add(STORES.INVENTORY, i); }
  async updateInventoryItem(id: string, i: Partial<InventoryItem>) {
      const items = await this.getInventory();
      const existing = items.find(x => x.id === id);
      if(existing) await this.update(STORES.INVENTORY, { ...existing, ...i });
  }
}

export const db = new DatabaseService();
