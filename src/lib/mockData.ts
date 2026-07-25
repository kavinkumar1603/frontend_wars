export type DealStage = 'New' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Lead' | 'Inactive';
}

export interface Deal {
  id: string;
  customerId: string;
  title: string;
  value: number;
  stage: DealStage;
  priority: Priority;
  expectedCloseDate: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
}

export interface Message {
  id: string;
  customerId: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'customer';
  read: boolean;
}

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Alice Johnson', company: 'TechCorp', email: 'alice@techcorp.com', phone: '+1 555-0101', avatar: 'https://i.pravatar.cc/150?u=c1', status: 'Active' },
  { id: 'c2', name: 'Bob Smith', company: 'DesignCo', email: 'bob@designco.com', phone: '+1 555-0102', avatar: 'https://i.pravatar.cc/150?u=c2', status: 'Lead' },
  { id: 'c3', name: 'Charlie Davis', company: 'WebSolutions', email: 'charlie@websol.com', phone: '+1 555-0103', avatar: 'https://i.pravatar.cc/150?u=c3', status: 'Active' },
  { id: 'c4', name: 'Diana Prince', company: 'Amazon', email: 'diana@amazon.com', phone: '+1 555-0104', avatar: 'https://i.pravatar.cc/150?u=c4', status: 'Lead' },
  { id: 'c5', name: 'Evan Wright', company: 'Startup Inc', email: 'evan@startup.inc', phone: '+1 555-0105', avatar: 'https://i.pravatar.cc/150?u=c5', status: 'Inactive' },
];

export const mockDeals: Deal[] = [
  { id: 'd1', customerId: 'c1', title: 'Enterprise License', value: 12000, stage: 'Proposal', priority: 'high', expectedCloseDate: '2026-08-15' },
  { id: 'd2', customerId: 'c2', title: 'Website Redesign', value: 4500, stage: 'Contacted', priority: 'medium', expectedCloseDate: '2026-08-20' },
  { id: 'd3', customerId: 'c3', title: 'SEO Audit', value: 1500, stage: 'New', priority: 'low', expectedCloseDate: '2026-09-01' },
  { id: 'd4', customerId: 'c4', title: 'Cloud Migration', value: 25000, stage: 'Won', priority: 'high', expectedCloseDate: '2026-07-10' },
  { id: 'd5', customerId: 'c2', title: 'Branding Package', value: 3000, stage: 'Lost', priority: 'medium', expectedCloseDate: '2026-07-15' },
  { id: 'd6', customerId: 'c5', title: 'Consulting Retainer', value: 5000, stage: 'Proposal', priority: 'medium', expectedCloseDate: '2026-08-05' },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Send proposal to TechCorp', dueDate: '2026-07-26', status: 'todo', priority: 'high', assignee: 'Me' },
  { id: 't2', title: 'Follow up with Bob', dueDate: '2026-07-25', status: 'in-progress', priority: 'medium', assignee: 'Me' },
  { id: 't3', title: 'Prepare Q3 report', dueDate: '2026-07-30', status: 'todo', priority: 'low', assignee: 'Me' },
  { id: 't4', title: 'Call Diana for feedback', dueDate: '2026-07-24', status: 'done', priority: 'medium', assignee: 'Me' },
];

export const mockMessages: Message[] = [
  { id: 'm1', customerId: 'c2', content: 'Hi, I would like to know more about your design services.', timestamp: '2026-07-24T10:00:00Z', sender: 'customer', read: true },
  { id: 'm2', customerId: 'c2', content: 'Hello Bob! Sure, I can help with that. What specifically are you looking for?', timestamp: '2026-07-24T10:15:00Z', sender: 'user', read: true },
  { id: 'm3', customerId: 'c2', content: 'We need a complete website redesign and new branding.', timestamp: '2026-07-24T10:30:00Z', sender: 'customer', read: true },
  { id: 'm4', customerId: 'c2', content: 'Can we schedule a call for tomorrow?', timestamp: '2026-07-25T09:00:00Z', sender: 'customer', read: false },
  
  { id: 'm5', customerId: 'c1', content: 'The proposal looks good. We just have a few questions regarding the SLA.', timestamp: '2026-07-25T11:20:00Z', sender: 'customer', read: false },
];
