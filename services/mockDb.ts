
import { Project, Task, TeamMember, ProjectDocument, Client, InventoryItem } from '../types';

// --- Initial Data Seeds (Moved from ProjectContext) ---

const initialProjects: Project[] = [
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
  },
  {
    id: 'p4',
    name: 'Eco-Friendly Office Park',
    code: 'ECO-OP-01',
    description: 'Net-zero energy office park with solar integration and rainwater harvesting.',
    location: 'North Hills',
    type: 'Commercial',
    status: 'Planning',
    health: 'Good',
    progress: 0,
    budget: 5000000,
    spent: 125000,
    startDate: '2025-12-01',
    endDate: '2027-06-01',
    manager: 'John Anderson',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    teamSize: 8,
    tasks: { total: 0, completed: 0, overdue: 0 },
    weatherLocation: { city: 'Seattle', temp: '55°', condition: 'Rain' }
  }
];

const initialTasks: Task[] = [
    { id: 't1', title: 'Safety inspection - Site A', projectId: 'p1', status: 'To Do', priority: 'High', assigneeName: 'Mike T.', assigneeType: 'user', dueDate: '2025-11-12' },
    { id: 't2', title: 'Concrete pouring - Level 2', projectId: 'p1', status: 'To Do', priority: 'High', assigneeName: 'All Operatives', assigneeType: 'role', dueDate: '2025-11-20' },
    { id: 't3', title: 'Complete foundation excavation', projectId: 'p1', status: 'In Progress', priority: 'High', assigneeName: 'David C.', assigneeType: 'user', dueDate: '2025-11-15' },
    { id: 't4', title: 'Install steel framework', projectId: 'p1', status: 'Done', priority: 'High', assigneeName: 'David C.', assigneeType: 'user', dueDate: '2025-11-08' },
    { id: 't5', title: 'Quality control inspection', projectId: 'p3', status: 'To Do', priority: 'High', assigneeName: 'Tom H.', assigneeType: 'user', dueDate: '2025-11-14' },
    { id: 't6', title: 'Install electrical conduits', projectId: 'p3', status: 'In Progress', priority: 'Medium', assigneeName: 'James W.', assigneeType: 'user', dueDate: '2025-11-18' },
    { id: 't7', title: 'Plumbing rough-in', projectId: 'p2', status: 'To Do', priority: 'Medium', assigneeName: 'Emma J.', assigneeType: 'user', dueDate: '2025-11-22' },
    { id: 't8', title: 'HVAC system installation', projectId: 'p2', status: 'In Progress', priority: 'Medium', assigneeName: 'Emma J.', assigneeType: 'user', dueDate: '2025-11-25' },
    { id: 't9', title: 'Prepare material estimates', projectId: 'p2', status: 'Done', priority: 'Medium', assigneeName: 'Sarah M.', assigneeType: 'user', dueDate: '2025-11-10' },
    { id: 't10', title: 'Landscaping preparation', projectId: 'p4', status: 'In Progress', priority: 'Low', assigneeName: 'Sam B.', assigneeType: 'user', dueDate: '2025-11-30' },
];

const initialTeam: TeamMember[] = [
    { 
      id: 'tm1', name: 'John Anderson', initials: 'JA', role: 'Principal Admin', status: 'On Site', 
      projectId: 'p1', projectName: 'City Centre Plaza Development', phone: '+44 7700 900001', color: 'bg-[#0f5c82]', email: 'john@buildcorp.com',
      bio: '20+ years in construction management. Specialized in large-scale commercial and infrastructure projects.',
      location: 'London, UK',
      skills: ['Strategic Planning', 'Budget Management', 'Stakeholder Relations', 'Contract Negotiation'],
      certifications: [
        { name: 'PMP - Project Management Professional', issuer: 'PMI', issueDate: '2020-05-15', expiryDate: '2026-05-15', status: 'Valid' },
        { name: 'PRINCE2 Practitioner', issuer: 'Axelos', issueDate: '2022-01-10', expiryDate: '2025-01-10', status: 'Expiring' }
      ],
      performanceRating: 98,
      completedProjects: 42
    },
    { 
      id: 'tm2', name: 'Sarah Mitchell', initials: 'SM', role: 'Company Admin', status: 'Off Site', 
      projectId: 'p2', projectName: 'Residential Complex - Phase 2', phone: '+44 7700 900002', color: 'bg-[#1f7d98]', email: 'sarah@buildcorp.com',
      bio: 'Expert in residential development and sustainable building practices.',
      location: 'Manchester, UK',
      skills: ['Sustainability', 'Team Leadership', 'Resource Allocation', 'Agile'],
      certifications: [
        { name: 'LEED Accredited Professional', issuer: 'USGBC', issueDate: '2021-03-20', expiryDate: '2025-03-20', status: 'Valid' },
        { name: 'IOSH Managing Safely', issuer: 'IOSH', issueDate: '2023-06-01', expiryDate: '2026-06-01', status: 'Valid' }
      ],
      performanceRating: 95,
      completedProjects: 18
    },
    { 
      id: 'tm3', name: 'Mike Thompson', initials: 'MT', role: 'Project Manager', status: 'On Site', 
      projectId: 'p1', projectName: 'City Centre Plaza Development', phone: '+44 7700 900003', color: 'bg-[#1f7d98]', email: 'mike@buildcorp.com',
      bio: 'Hands-on project manager with a background in civil engineering.',
      location: 'London, UK',
      skills: ['Civil Engineering', 'Site Safety', 'AutoCAD', 'Scheduling'],
      certifications: [
        { name: 'OSHA 30-Hour Construction', issuer: 'OSHA', issueDate: '2023-09-10', expiryDate: '2028-09-10', status: 'Valid' }
      ],
      performanceRating: 88,
      completedProjects: 12
    },
    { 
      id: 'tm4', name: 'David Chen', initials: 'DC', role: 'Foreman', status: 'On Site', 
      projectId: 'p3', projectName: 'Highway Bridge Repair', phone: '+44 7700 900004', color: 'bg-[#0f5c82]', email: 'david@buildcorp.com',
      bio: 'Seasoned foreman with specialized experience in concrete and steel structures.',
      location: 'Birmingham, UK',
      skills: ['Concrete', 'Formwork', 'Team Supervision', 'Heavy Machinery'],
      certifications: [
        { name: 'First Aid at Work', issuer: 'Red Cross', issueDate: '2024-01-15', expiryDate: '2027-01-15', status: 'Valid' },
        { name: 'SSSTS - Site Supervisor', issuer: 'CITB', issueDate: '2022-11-05', expiryDate: '2027-11-05', status: 'Valid' }
      ],
      performanceRating: 92,
      completedProjects: 25
    },
    { 
      id: 'tm5', name: 'James Wilson', initials: 'JW', role: 'Operative', status: 'On Break', 
      projectId: 'p3', projectName: 'Highway Bridge Repair', phone: '+44 7700 900005', color: 'bg-[#1f7d98]', email: 'james@buildcorp.com', 
      bio: 'Skilled plant operator with 8 years of experience operating excavators and cranes.',
      location: 'Liverpool, UK',
      skills: ['Heavy Machinery', 'Excavation', 'Site Logistics'], 
      certifications: [
        { name: 'CPCS Blue Card', issuer: 'NOCN', issueDate: '2021-05-20', expiryDate: '2026-05-20', status: 'Valid' }
      ],
      performanceRating: 85,
      completedProjects: 8 
    },
    { 
      id: 'tm6', name: 'Robert Garcia', initials: 'RG', role: 'Operative', status: 'On Site', 
      projectId: 'p1', projectName: 'City Centre Plaza Development', phone: '+44 7700 900007', color: 'bg-[#1f7d98]', email: 'robert@buildcorp.com', 
      bio: 'Certified electrician with experience in both residential and commercial installations.',
      location: 'London, UK',
      skills: ['Electrical', 'Wiring', 'Testing & Inspection', 'BMS Systems'], 
      certifications: [
         { name: '18th Edition Wiring Regulations', issuer: 'City & Guilds', issueDate: '2019-07-10', expiryDate: 'N/A', status: 'Valid' },
         { name: 'ECS Gold Card', issuer: 'JIB', issueDate: '2022-02-14', expiryDate: '2025-02-14', status: 'Expiring' }
      ],
      performanceRating: 90,
      completedProjects: 15 
    },
    { 
      id: 'tm7', name: 'Emma Johnson', initials: 'EJ', role: 'Project Manager', status: 'On Site', 
      projectId: 'p2', projectName: 'Residential Complex - Phase 2', phone: '+44 7700 900008', color: 'bg-[#1f7d98]', email: 'emma@buildcorp.com', 
      bio: 'Architect turned Project Manager, bringing design sensibility to construction execution.',
      location: 'Leeds, UK',
      skills: ['Architecture', 'BIM', 'Design Management', 'Client Liaison'], 
      certifications: [
        { name: 'RIBA Chartered Architect', issuer: 'RIBA', issueDate: '2018-09-01', expiryDate: 'N/A', status: 'Valid' }
      ],
      performanceRating: 94,
      completedProjects: 10 
    },
];

const initialDocs: ProjectDocument[] = [
    { id: 'd1', name: 'City Centre - Structural Plans', type: 'CAD', projectId: 'p1', projectName: 'City Centre Plaza', size: '12.5 MB', date: '2025-10-15', status: 'Approved' },
    { id: 'd2', name: 'Building Permit - Phase 1', type: 'Document', projectId: 'p1', projectName: 'City Centre Plaza', size: '2.3 MB', date: '2025-09-20', status: 'Approved' },
    { id: 'd3', name: 'October Progress Photos', type: 'Image', projectId: 'p1', projectName: 'City Centre Plaza', size: '45.8 MB', date: '2025-11-05', status: 'Approved' },
    { id: 'd4', name: 'Safety Compliance Report', type: 'Document', projectId: 'p2', projectName: 'Residential Complex', size: '5.2 MB', date: '2025-11-01', status: 'Approved' },
    { id: 'd5', name: 'Invoice #INV-2025-001', type: 'Document', projectId: 'p1', projectName: 'City Centre Plaza', size: '1.1 MB', date: '2025-11-08', status: 'Pending' },
    { id: 'd6', name: 'Environmental Impact Assessment', type: 'Document', projectId: 'p3', projectName: 'Highway Bridge', size: '8.7 MB', date: '2025-10-20', status: 'Approved' },
    { id: 'd7', name: 'Architectural Drawings - Rev 3', type: 'CAD', projectId: 'p2', projectName: 'Residential Complex', size: '18.4 MB', date: '2025-10-25', status: 'Approved' },
];

const initialClients: Client[] = [
    { id: 'c1', name: 'Metro Development Group', contactPerson: 'Alice Walker', role: 'Director of Operations', email: 'alice@metrodev.com', phone: '(555) 123-4567', status: 'Active', tier: 'Gold', activeProjects: 3, totalValue: '£45.2M' },
    { id: 'c2', name: 'City Council', contactPerson: 'Robert Stone', role: 'Senior Planner', email: 'r.stone@city.gov', phone: '(555) 987-6543', status: 'Active', tier: 'Government', activeProjects: 1, totalValue: '£8.5M' },
    { id: 'c3', name: 'Greenfield Estates', contactPerson: 'James Miller', role: 'CEO', email: 'jmiller@greenfield.com', phone: '(555) 456-7890', status: 'Lead', tier: 'Silver', activeProjects: 0, totalValue: '£0' },
    { id: 'c4', name: 'TechPark Innovations', contactPerson: 'Sarah Chen', role: 'Facilities Manager', email: 'schen@techpark.io', phone: '(555) 222-3333', status: 'Active', tier: 'Platinum', activeProjects: 2, totalValue: '£22.8M' },
];

const initialInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Portland Cement Type I', category: 'Raw Materials', stock: 450, unit: 'Bags', threshold: 100, status: 'In Stock', location: 'Warehouse A', lastOrderDate: '2025-10-20', costPerUnit: 12.50 },
    { id: 'INV-002', name: 'Steel Rebar #4', category: 'Raw Materials', stock: 1200, unit: 'Lengths', threshold: 500, status: 'In Stock', location: 'Yard B', lastOrderDate: '2025-11-01', costPerUnit: 8.75 },
    { id: 'INV-003', name: 'Safety Helmets (White)', category: 'Safety Gear', stock: 12, unit: 'Units', threshold: 20, status: 'Low Stock', location: 'Site Office', lastOrderDate: '2025-08-15', costPerUnit: 15.00 },
    { id: 'INV-004', name: 'Electrical Conduit 3/4"', category: 'Consumables', stock: 0, unit: 'Feet', threshold: 200, status: 'Out of Stock', location: 'Warehouse A', lastOrderDate: '2025-09-10', costPerUnit: 2.20 },
    { id: 'INV-005', name: 'Pine Lumber 2x4', category: 'Raw Materials', stock: 340, unit: 'Boards', threshold: 150, status: 'In Stock', location: 'Yard B', lastOrderDate: '2025-11-05', costPerUnit: 6.50 },
];

// --- Persistence Logic ---

const DB_KEYS = {
  PROJECTS: 'buildpro_projects',
  TASKS: 'buildpro_tasks',
  TEAM: 'buildpro_team',
  DOCS: 'buildpro_docs',
  CLIENTS: 'buildpro_clients',
  INVENTORY: 'buildpro_inventory',
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(DB_KEYS.PROJECTS)) localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(initialProjects));
    if (!localStorage.getItem(DB_KEYS.TASKS)) localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(initialTasks));
    if (!localStorage.getItem(DB_KEYS.TEAM)) localStorage.setItem(DB_KEYS.TEAM, JSON.stringify(initialTeam));
    if (!localStorage.getItem(DB_KEYS.DOCS)) localStorage.setItem(DB_KEYS.DOCS, JSON.stringify(initialDocs));
    if (!localStorage.getItem(DB_KEYS.CLIENTS)) localStorage.setItem(DB_KEYS.CLIENTS, JSON.stringify(initialClients));
    if (!localStorage.getItem(DB_KEYS.INVENTORY)) localStorage.setItem(DB_KEYS.INVENTORY, JSON.stringify(initialInventory));
  }

  // --- Generic CRUD Helpers ---
  private getItems<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItems<T>(key: string, items: T[]) {
    localStorage.setItem(key, JSON.stringify(items));
  }

  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    await delay(300);
    return this.getItems<Project>(DB_KEYS.PROJECTS);
  }

  async addProject(project: Project): Promise<void> {
    await delay(300);
    const items = this.getItems<Project>(DB_KEYS.PROJECTS);
    this.setItems(DB_KEYS.PROJECTS, [project, ...items]);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await delay(200);
    const items = this.getItems<Project>(DB_KEYS.PROJECTS);
    this.setItems(DB_KEYS.PROJECTS, items.map(i => i.id === id ? { ...i, ...updates } : i));
  }

  async deleteProject(id: string): Promise<void> {
    await delay(200);
    const items = this.getItems<Project>(DB_KEYS.PROJECTS);
    this.setItems(DB_KEYS.PROJECTS, items.filter(i => i.id !== id));
  }

  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    await delay(200);
    return this.getItems<Task>(DB_KEYS.TASKS);
  }

  async addTask(task: Task): Promise<void> {
    await delay(200);
    const items = this.getItems<Task>(DB_KEYS.TASKS);
    this.setItems(DB_KEYS.TASKS, [task, ...items]);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await delay(100);
    const items = this.getItems<Task>(DB_KEYS.TASKS);
    this.setItems(DB_KEYS.TASKS, items.map(i => i.id === id ? { ...i, ...updates } : i));
  }

  // --- Team ---
  async getTeam(): Promise<TeamMember[]> {
    await delay(200);
    return this.getItems<TeamMember>(DB_KEYS.TEAM);
  }

  async addTeamMember(member: TeamMember): Promise<void> {
    await delay(200);
    const items = this.getItems<TeamMember>(DB_KEYS.TEAM);
    this.setItems(DB_KEYS.TEAM, [member, ...items]);
  }

  // --- Docs ---
  async getDocuments(): Promise<ProjectDocument[]> {
    await delay(200);
    return this.getItems<ProjectDocument>(DB_KEYS.DOCS);
  }

  async addDocument(doc: ProjectDocument): Promise<void> {
    await delay(200);
    const items = this.getItems<ProjectDocument>(DB_KEYS.DOCS);
    this.setItems(DB_KEYS.DOCS, [doc, ...items]);
  }

  // --- Clients ---
  async getClients(): Promise<Client[]> {
    await delay(200);
    return this.getItems<Client>(DB_KEYS.CLIENTS);
  }

  async addClient(client: Client): Promise<void> {
    await delay(200);
    const items = this.getItems<Client>(DB_KEYS.CLIENTS);
    this.setItems(DB_KEYS.CLIENTS, [client, ...items]);
  }

  // --- Inventory ---
  async getInventory(): Promise<InventoryItem[]> {
    await delay(200);
    return this.getItems<InventoryItem>(DB_KEYS.INVENTORY);
  }

  async addInventoryItem(item: InventoryItem): Promise<void> {
    await delay(200);
    const items = this.getItems<InventoryItem>(DB_KEYS.INVENTORY);
    this.setItems(DB_KEYS.INVENTORY, [item, ...items]);
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    await delay(100);
    const items = this.getItems<InventoryItem>(DB_KEYS.INVENTORY);
    this.setItems(DB_KEYS.INVENTORY, items.map(i => i.id === id ? { ...i, ...updates } : i));
  }
}

export const db = new MockDatabase();
