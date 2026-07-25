import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, KanbanSquare, CheckSquare, MessageCircle, BarChart3, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: KanbanSquare, label: 'Pipeline', href: '/pipeline' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">M</div>
            <span className="font-bold text-lg tracking-tight">MicroCRM Ops</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Only for Sidebar Toggle, plus user profile) */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden flex items-center gap-2 text-primary font-bold">
             <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl">M</div>
             MicroCRM Ops
          </div>
          <div className="hidden md:block">
             <h2 className="text-sm font-medium text-muted-foreground">Workspace</h2>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search or notifications could go here */}
             <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=me" alt="User" />
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
