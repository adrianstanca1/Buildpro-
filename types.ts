import React from 'react';

export enum Page {
  LOGIN = 'LOGIN',
  PROFILE = 'PROFILE',
  AI_TOOLS = 'AI_TOOLS',
  REPORTS = 'REPORTS',
  SCHEDULE = 'SCHEDULE',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT', // AI Assistant
  TEAM_CHAT = 'TEAM_CHAT', // Team Chat
  LIVE = 'LIVE',
  PROJECTS = 'PROJECTS',
  PROJECT_DETAILS = 'PROJECT_DETAILS',
  TASKS = 'TASKS',
  TEAM = 'TEAM',
  TIMESHEETS = 'TIMESHEETS',
  DOCUMENTS = 'DOCUMENTS',
  SAFETY = 'SAFETY',
  EQUIPMENT = 'EQUIPMENT',
  FINANCIALS = 'FINANCIALS',
  MAP_VIEW = 'MAP_VIEW',
  ML_INSIGHTS = 'ML_INSIGHTS',
  COMPLIANCE = 'COMPLIANCE',
  PROCUREMENT = 'PROCUREMENT',
  CLIENTS = 'CLIENTS',
  INVENTORY = 'INVENTORY',
  CUSTOM_DASH = 'CUSTOM_DASH',
  WORKFORCE = 'WORKFORCE',
  INTEGRATIONS = 'INTEGRATIONS',
  SECURITY = 'SECURITY',
  DEV_SANDBOX = 'DEV_SANDBOX',
  MARKETPLACE = 'MARKETPLACE',
  EXECUTIVE = 'EXECUTIVE',
  IMAGINE = 'IMAGINE',
  MY_DESKTOP = 'MY_DESKTOP',
  LIVE_PROJECT_MAP = 'LIVE_PROJECT_MAP',
  PROJECT_LAUNCHPAD = 'PROJECT_LAUNCHPAD'
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin',
  SUPERVISOR = 'supervisor',
  OPERATIVE = 'operative'
}

export interface Zone {
  id: string;
  label: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  top: number;
  left: number;
  width: number;
  height: number;
  protocol?: string;
  trigger?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  location: string;
  type: 'Commercial' | 'Residential' | 'Infrastructure' | 'Industrial' | 'Healthcare';
  status: 'Active' | 'Planning' | 'Delayed' | 'Completed' | 'On Hold';
  health: 'Good' | 'At Risk' | 'Critical';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  manager: string;
  image: string;
  teamSize: number;
  tasks: {
    total: number;
    completed: number;
    overdue: number;
  };
  weatherLocation?: {
    city: string;
    temp: string;
    condition: string;
  };
  aiAnalysis?: string; // AI generated summary
  zones?: Zone[];
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
  priority: 'High' | 'Medium' | 'Low';
  assigneeId?: string;
  assigneeName?: string; // Denormalized for easy display
  assigneeType: 'user' | 'role';
  dueDate: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring' | 'Expired';
  docUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: 'On Site' | 'Off Site' | 'On Break' | 'Leave';
  projectId?: string; // Current assignment
  projectName?: string; // Denormalized
  phone: string;
  email: string;
  color: string;
  // Extended Fields
  bio?: string;
  location?: string;
  joinDate?: string;
  skills?: string[];
  certifications?: Certification[];
  performanceRating?: number; // 0-100
  completedProjects?: number;
  hourlyRate?: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'PDF' | 'Spreadsheet' | 'Document' | 'Image' | 'CAD' | 'Other';
  projectId: string;
  projectName?: string;
  size: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Draft';
  url?: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Lead' | 'Inactive';
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Government';
  activeProjects: number;
  totalValue: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastOrderDate?: string;
  costPerUnit?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyId?: string;
  projectIds?: string[];
  avatarInitials: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface MarketplaceApp {
  id: string;
  name: string;
  category: string;
  desc: string;
  rating: number;
  downloads: string;
  icon: React.ElementType | string;
  installed: boolean;
}