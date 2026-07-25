import { useState } from 'react';
import { useCrmStore } from '../store/useCrmStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Plus, LayoutList } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

export function Tasks() {
  const { tasks, updateTaskStatus } = useCrmStore();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate] = useState(new Date(2026, 6, 25)); // July 2026 based on mock data

  const handleToggleStatus = (taskId: string, currentStatus: string) => {
    updateTaskStatus(taskId, currentStatus === 'done' ? 'todo' : 'done');
  };

  const priorityColor = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive'
  } as const;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = addDays(startOfWeek(monthEnd), 6);
  
  const dateFormat = "d";
  const days = eachDayOfInterval({
      start: startDate,
      end: endDate
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks & Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and to-dos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-1 rounded-md flex items-center">
            <button 
              onClick={() => setView('list')} 
              className={`p-1.5 rounded text-sm ${view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`p-1.5 rounded text-sm ${view === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" /> New Task</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'list' ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id} className={`transition-opacity ${task.status === 'done' ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggleStatus(task.id, task.status)} className="text-muted-foreground hover:text-primary transition-colors">
                      {task.status === 'done' ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div>
                      <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        {task.status === 'in-progress' && <span className="flex items-center gap-1 text-blue-500"><Clock className="w-3 h-3" /> In Progress</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={priorityColor[task.priority as keyof typeof priorityColor] as any}>{task.priority}</Badge>
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border border-border">
                      {task.assignee.charAt(0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-4">
               <CardTitle className="text-lg">{format(currentDate, 'MMMM yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-7 mb-2">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                   <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
                 ))}
               </div>
               <div className="grid grid-cols-7 gap-1 border-t border-border pt-2">
                 {days.map((day, i) => {
                   const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), day));
                   const isCurrentMonth = isSameMonth(day, monthStart);
                   return (
                     <div key={i} className={`min-h-[100px] p-2 rounded-md border ${isCurrentMonth ? 'border-border/50 bg-background' : 'border-transparent bg-secondary/30 text-muted-foreground'} hover:border-primary/50 transition-colors`}>
                       <div className="text-right text-sm font-medium mb-1">{format(day, dateFormat)}</div>
                       <div className="space-y-1">
                         {dayTasks.map(t => (
                           <div key={t.id} className={`text-xs p-1 rounded truncate ${t.status === 'done' ? 'bg-secondary text-muted-foreground line-through' : 'bg-primary/10 text-primary font-medium'}`} title={t.title}>
                             {t.title}
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })}
               </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
