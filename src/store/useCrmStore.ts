import { create } from 'zustand';
import type { Customer, Deal, Task, Message, DealStage } from '../lib/mockData';
import { mockCustomers, mockDeals, mockTasks, mockMessages } from '../lib/mockData';

interface CrmState {
  customers: Customer[];
  deals: Deal[];
  tasks: Task[];
  messages: Message[];
  
  // Actions
  addCustomer: (customer: Customer) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  sendMessage: (message: Message) => void;
  markMessagesAsRead: (customerId: string) => void;
}

export const useCrmStore = create<CrmState>((set) => ({
  customers: mockCustomers,
  deals: mockDeals,
  tasks: mockTasks,
  messages: mockMessages,
  
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  
  updateDealStage: (dealId, newStage) => set((state) => ({
    deals: state.deals.map((deal) => deal.id === dealId ? { ...deal, stage: newStage } : deal)
  })),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  
  updateTaskStatus: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === taskId ? { ...task, status: newStatus } : task)
  })),
  
  sendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  markMessagesAsRead: (customerId) => set((state) => ({
    messages: state.messages.map((msg) => 
      (msg.customerId === customerId && !msg.read) ? { ...msg, read: true } : msg
    )
  })),
}));
